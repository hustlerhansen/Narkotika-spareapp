import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type pg from "pg";
import { as, connect, createUser } from "./db";

let db: pg.Client;
let person: string;
let analyst: string;
let support: string;

beforeAll(async () => {
  db = connect();
  await db.connect();
  person = await createUser(db);
  analyst = await createUser(db);
  support = await createUser(db);
  await db.query(`insert into public.admin_roles (user_id, role) values ($1, 'analyst'), ($2, 'support_admin')`, [analyst, support]);
});

afterAll(async () => {
  await db.end();
});

describe("technical error counts (no personal data)", () => {
  it("anyone can report a coded error; counts aggregate per day/code/area/release", async () => {
    await db.query("delete from public.error_counts");
    await as(db, { role: "anon" }, (q) => q(`select public.report_client_error('render_error', 'tools', 'test-1')`), { commit: true });
    await as(db, { role: "authenticated", userId: person }, (q) => q(`select public.report_client_error('render_error', 'tools', 'test-1')`), {
      commit: true,
    });
    const r = await db.query(`select code, area, release, count from public.error_counts`);
    expect(r.rows).toEqual([{ code: "render_error", area: "tools", release: "test-1", count: 2 }]);
  });

  it("stores no user identifier, URL or free text (schema check)", async () => {
    const cols = await db.query(`select column_name from information_schema.columns where table_schema = 'public' and table_name = 'error_counts' order by 1`);
    expect(cols.rows.map((c) => c.column_name)).toEqual(["area", "code", "count", "day", "release"]);
  });

  it("silently ignores unknown codes, areas and malformed releases (bounded cardinality)", async () => {
    const before = (await db.query(`select count(*)::int n from public.error_counts`)).rows[0].n;
    await as(db, { role: "anon" }, async (q) => {
      await q(`select public.report_client_error('my journal says hello', 'tools', 'x')`);
      await q(`select public.report_client_error('render_error', '/verktoy/dagbok?id=123', 'x')`);
      await q(`select public.report_client_error('render_error', 'tools', 'has spaces and ${"x".repeat(50)}')`);
    }, { commit: true });
    expect((await db.query(`select count(*)::int n from public.error_counts`)).rows[0].n).toBe(before);
  });

  it("the table itself is not readable or writable by app roles", async () => {
    await expect(as(db, { role: "anon" }, (q) => q(`select * from public.error_counts`))).rejects.toThrow(/permission denied/);
    await expect(as(db, { role: "authenticated", userId: analyst }, (q) => q(`select * from public.error_counts`))).rejects.toThrow(/permission denied/);
    await expect(
      as(db, { role: "authenticated", userId: person }, (q) => q(`insert into public.error_counts (code, area, count) values ('unknown', 'other', 999)`)),
    ).rejects.toThrow(/permission denied/);
  });

  it("pruning is not callable by app roles", async () => {
    await expect(as(db, { role: "authenticated", userId: analyst }, (q) => q(`select public.prune_error_counts()`))).rejects.toThrow(/permission denied/);
  });
});

describe("admin overview", () => {
  it("is forbidden for ordinary users and anonymous visitors", async () => {
    await expect(as(db, { role: "authenticated", userId: person }, (q) => q(`select public.admin_overview()`))).rejects.toThrow(/forbidden/);
    await expect(as(db, { role: "anon" }, (q) => q(`select public.admin_overview()`))).rejects.toThrow(/permission denied/);
  });

  it("returns only suppressed aggregates, error counts and flags – no personal content – and is audited", async () => {
    const res = await as(db, { role: "authenticated", userId: support }, (q) => q(`select public.admin_overview() as o`), { commit: true });
    const o = res.rows[0].o;
    expect(Object.keys(o).sort()).toEqual(["accounts", "errorsLast14Days", "flags", "generatedAt", "suppressionThreshold"]);
    expect(Object.keys(o.accounts).sort()).toEqual(["activeLast30Days", "activeLast7Days", "confirmed", "newLast7Days", "registered"]);
    // The test database has fewer than 10 users in these groups → suppressed.
    expect(o.accounts.newLast7Days === null || o.accounts.newLast7Days >= 10).toBe(true);
    expect(o.accounts.activeLast7Days).toBeNull();
    const text = JSON.stringify(o);
    for (const forbidden of ["@test.local", person, "reflection", "journal", "craving", "note"]) expect(text).not.toContain(forbidden);
    const audit = await db.query(`select actor_id from public.audit_events where action = 'admin_overview_viewed'`);
    expect(audit.rows.map((r) => r.actor_id)).toContain(support);
  });

  it("small groups are suppressed, groups of 10 or more are shown", async () => {
    for (let i = 0; i < 10; i++) {
      const id = await createUser(db);
      await db.query(`update auth.users set last_sign_in_at = now(), email_confirmed_at = now() where id = $1`, [id]);
    }
    const o = (await as(db, { role: "authenticated", userId: analyst }, (q) => q(`select public.admin_overview() as o`))).rows[0].o;
    expect(o.accounts.activeLast7Days).toBeGreaterThanOrEqual(10);
  });

  it("my_admin_roles tells the UI which roles the caller has, and nothing about others", async () => {
    const mine = await as(db, { role: "authenticated", userId: analyst }, (q) => q(`select public.my_admin_roles() as r`));
    expect(mine.rows[0].r).toEqual("{analyst}");
    const none = await as(db, { role: "authenticated", userId: person }, (q) => q(`select public.my_admin_roles() as r`));
    expect(none.rows[0].r).toEqual("{}");
  });
});

describe("check-in day status parity", () => {
  it("accepts drug_free/used/null and rejects anything else", async () => {
    await as(db, { role: "authenticated", userId: person }, async (q) => {
      await q(`insert into public.daily_checkins (user_id, checkin_date, mood, craving, day_status) values ($1, current_date, 3, 2, 'drug_free')`, [person]);
      await expect(
        q(`insert into public.daily_checkins (user_id, checkin_date, mood, craving, day_status) values ($1, current_date - 1, 3, 2, 'maybe')`, [person]),
      ).rejects.toThrow(/check constraint/);
    });
  });
});
