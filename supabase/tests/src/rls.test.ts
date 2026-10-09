import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type pg from "pg";
import { as, connect, createUser } from "./db";
import { buildSeedSql } from "./seed";

let db: pg.Client;
let alice: string;
let bob: string;

/** Inserts one row into every owner-scoped table for `uid`, as that user. */
async function seedUserData(uid: string) {
  return as(
    db,
    { role: "authenticated", userId: uid },
    async (q) => {
      await q(`insert into public.profiles (id, is_adult_confirmed, goal, motivation_presets) values ($1, true, 'quit', '{children}')`, [uid]);
      await q(`insert into public.user_preferences (user_id) values ($1)`, [uid]);
      await q(`insert into public.recovery_goals (user_id, goal) values ($1, 'quit')`, [uid]);
      const sub = await q(
        `insert into public.user_substances (user_id, substance_type_id, mode, is_primary, tracking_started_at)
         values ($1, 'crack_cocaine', 'abstinence', true, now() - interval '10 days') returning id`,
        [uid],
      );
      const subId = sub.rows[0].id as string;
      await q(`insert into public.financial_baselines (user_substance_id, user_id, amount, period) values ($1, $2, 1000, 'day')`, [subId, uid]);
      await q(`insert into public.recovery_periods (user_id, user_substance_id, started_at) values ($1, $2, now() - interval '10 days')`, [uid, subId]);
      await q(`insert into public.use_events (user_id, user_substance_id, occurred_at, amount_spent) values ($1, $2, now() - interval '11 days', 500)`, [uid, subId]);
      await q(`insert into public.daily_checkins (user_id, checkin_date, mood, craving, note) values ($1, current_date, 2, 7, 'privat')`, [uid]);
      const trig = await q(`insert into public.personal_triggers (user_id, category) values ($1, 'stress') returning id`, [uid]);
      await q(`insert into public.craving_events (user_id, started_at, intensity_before, tools_used, trigger_id) values ($1, now(), 8, '{breathing}', $2)`, [uid, trig.rows[0].id]);
      await q(`insert into public.journal_entries (user_id, entry_date, reflection) values ($1, current_date, 'hemmelig dagbok')`, [uid]);
      await q(`insert into public.savings_goals (user_id, title, category, target_amount) values ($1, 'Ferie', 'vacation', 10000)`, [uid]);
      await q(`insert into public.user_achievements (user_id, achievement_id, user_substance_id, achieved_at) values ($1, 'time_24h', $2, now())`, [uid, subId]);
      const plan = await q(`insert into public.recovery_plans (user_id, goal) values ($1, 'quit') returning id`, [uid]);
      await q(`insert into public.recovery_tasks (user_id, plan_id, key, kind) values ($1, $2, 'learn_sos', 'support')`, [uid, plan.rows[0].id]);
      await q(`insert into public.trusted_contacts (user_id, name, phone) values ($1, 'Kari', '+47 900 00 000')`, [uid]);
      await q(`insert into public.consent_records (user_id, purpose, policy_version) values ($1, 'ai_coach', '2026-10-ai-v1')`, [uid]);
      const conv = await q(`insert into public.ai_conversations (user_id) values ($1) returning id`, [uid]);
      await q(`insert into public.ai_messages (conversation_id, user_id, role, content) values ($1, $2, 'user', 'privat samtale')`, [conv.rows[0].id, uid]);
      await q(`insert into public.notification_preferences (user_id) values ($1)`, [uid]);
      // Phase 3
      const ptrig = await q(`insert into public.personal_triggers (user_id, kind, preset_key) values ($1, 'situation', 'payday') returning id`, [uid]);
      const ev = await q(
        `insert into public.craving_events (user_id, started_at, intensity_before, source, emotions, strategy_keys, helpful) values ($1, now(), 7, 'log', '{stressed}', '{breathing}', 'yes') returning id`,
        [uid],
      );
      await q(`insert into public.craving_event_triggers (craving_event_id, trigger_id, user_id) values ($1, $2, $3)`, [ev.rows[0].id, ptrig.rows[0].id, uid]);
      await q(`insert into public.coping_strategies (user_id, label) values ($1, 'Spille gitar')`, [uid]);
      const task = await q(
        `insert into public.recovery_tasks (user_id, title, category, task_date, recurrence, recurrence_days) values ($1, 'Gå tur', 'exercise', current_date, 'weekly', '{1,3}') returning id`,
        [uid],
      );
      await q(`insert into public.task_completions (task_id, user_id, occurrence_date) values ($1, $2, current_date)`, [task.rows[0].id, uid]);
      await q(`insert into public.weekly_goals (user_id, week_start, title, target) values ($1, date_trunc('week', now())::date, 'Ett møte', 1)`, [uid]);
      await q(`insert into public.personal_recovery_plans (user_id, content) values ($1, '{"reasons":"barna"}')`, [uid]);
      await q(`insert into public.article_activity (user_id, article_id, bookmarked, progress) values ($1, 'hva-er-crack', true, 0.5)`, [uid]);
      await q(`update public.journal_entries set mood = 9, emotions = '{hopeful}', tags = '{familie}', is_important = true where user_id = $1`, [uid]);
      await q(`insert into public.consent_records (user_id, purpose, policy_version) values ($1, 'cloud_storage_health_data', '2026-10')`, [uid]);
      return subId;
    },
    { commit: true },
  );
}

const OWNER_TABLES: [table: string, ownerColumn: string][] = [
  ["profiles", "id"],
  ["user_preferences", "user_id"],
  ["consent_records", "user_id"],
  ["recovery_goals", "user_id"],
  ["user_substances", "user_id"],
  ["financial_baselines", "user_id"],
  ["recovery_periods", "user_id"],
  ["use_events", "user_id"],
  ["daily_checkins", "user_id"],
  ["personal_triggers", "user_id"],
  ["craving_events", "user_id"],
  ["journal_entries", "user_id"],
  ["savings_goals", "user_id"],
  ["user_achievements", "user_id"],
  ["recovery_plans", "user_id"],
  ["recovery_tasks", "user_id"],
  ["trusted_contacts", "user_id"],
  ["ai_conversations", "user_id"],
  ["ai_messages", "user_id"],
  ["notification_preferences", "user_id"],
  // Phase 3
  ["craving_event_triggers", "user_id"],
  ["coping_strategies", "user_id"],
  ["task_completions", "user_id"],
  ["weekly_goals", "user_id"],
  ["personal_recovery_plans", "user_id"],
  ["article_activity", "user_id"],
];

let aliceSubstanceId: string;

beforeAll(async () => {
  db = connect();
  await db.connect();
  alice = await createUser(db);
  bob = await createUser(db);
  aliceSubstanceId = await seedUserData(alice);
  await seedUserData(bob);
});

afterAll(async () => {
  await db.end();
});

describe("schema guarantees", () => {
  it("every table in public has RLS enabled", async () => {
    const r = await db.query(`select tablename from pg_tables where schemaname = 'public' and not rowsecurity`);
    expect(r.rows).toEqual([]);
  });

  it("seed.sql is generated from the current core catalogues", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    expect(readFileSync(join(here, "..", "..", "seed.sql"), "utf8")).toBe(buildSeedSql());
  });
});

describe("owner isolation (users never see each other's data)", () => {
  it.each(OWNER_TABLES)("%s: a user sees exactly their own rows", async (table, col) => {
    const rows = await as(db, { role: "authenticated", userId: alice }, (q) => q(`select ${col} as owner from public.${table}`));
    expect(rows.rowCount).toBeGreaterThan(0);
    expect(rows.rows.every((r) => r.owner === alice)).toBe(true);
  });

  it.each(OWNER_TABLES)("%s: updates and deletes on another user's rows affect nothing", async (table, col) => {
    await as(db, { role: "authenticated", userId: bob }, async (q) => {
      const upd = await q(`update public.${table} set ${col} = ${col} where ${col} = $1`, [alice]);
      expect(upd.rowCount).toBe(0);
    });
    if (table === "consent_records") {
      // Consent records are never deletable by users (proof of consent, GDPR art. 7(1)).
      await expect(
        as(db, { role: "authenticated", userId: bob }, (q) => q(`delete from public.${table} where ${col} = $1`, [alice])),
      ).rejects.toThrow(/permission denied/);
    } else {
      await as(db, { role: "authenticated", userId: bob }, async (q) => {
        const del = await q(`delete from public.${table} where ${col} = $1`, [alice]);
        expect(del.rowCount).toBe(0);
      });
    }
    const still = await db.query(`select count(*)::int as n from public.${table} where ${col} = $1`, [alice]);
    expect(still.rows[0].n).toBeGreaterThan(0);
  });

  it("cannot insert rows on behalf of another user", async () => {
    await expect(
      as(db, { role: "authenticated", userId: bob }, (q) =>
        q(`insert into public.daily_checkins (user_id, checkin_date, mood, craving) values ($1, current_date - 1, 3, 3)`, [alice]),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("cannot move own rows to another user", async () => {
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) => q(`update public.journal_entries set user_id = $1`, [bob])),
    ).rejects.toThrow(/row-level security/);
  });

  it("cannot attach own rows to another user's substance (composite FK)", async () => {
    await expect(
      as(db, { role: "authenticated", userId: bob }, (q) =>
        q(`insert into public.use_events (user_id, user_substance_id, occurred_at) values ($1, $2, now())`, [bob, aliceSubstanceId]),
      ),
    ).rejects.toThrow(/foreign key/);
  });

  it("anonymous visitors can read the help directory but no personal data", async () => {
    await as(db, { role: "anon" }, async (q) => {
      const res = await q(`select id from public.support_resources where phone = '113'`);
      expect(res.rowCount).toBe(1);
    });
    await expect(as(db, { role: "anon" }, (q) => q(`select * from public.profiles`))).rejects.toThrow(/permission denied/);
    await expect(as(db, { role: "anon" }, (q) => q(`select * from public.daily_checkins`))).rejects.toThrow(/permission denied/);
  });
});

describe("integrity constraints", () => {
  it("one open recovery period per substance", async () => {
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) =>
        q(`insert into public.recovery_periods (user_id, user_substance_id, started_at) values ($1, $2, now())`, [alice, aliceSubstanceId]),
      ),
    ).rejects.toThrow(/recovery_periods_one_open_idx/);
  });

  it("one primary substance per user", async () => {
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) =>
        q(`insert into public.user_substances (user_id, substance_type_id, mode, is_primary, tracking_started_at) values ($1, 'alcohol', 'abstinence', true, now())`, [alice]),
      ),
    ).rejects.toThrow(/user_substances_one_primary_idx/);
  });

  it("rejects out-of-range check-ins and adult confirmation = false", async () => {
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) =>
        q(`insert into public.daily_checkins (user_id, checkin_date, mood, craving) values ($1, current_date - 3, 3, 11)`, [alice]),
      ),
    ).rejects.toThrow(/check constraint/);
    const carol = await createUser(db);
    await expect(
      as(db, { role: "authenticated", userId: carol }, (q) =>
        q(`insert into public.profiles (id, is_adult_confirmed, goal) values ($1, false, 'quit')`, [carol]),
      ),
    ).rejects.toThrow(/check constraint/);
  });
});

describe("subscriptions and consents", () => {
  it("users can read but never write their subscription", async () => {
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) =>
        q(`insert into public.subscriptions (user_id, provider, provider_subscription_id, status) values ($1, 'stripe', 'sub_x', 'active')`, [alice]),
      ),
    ).rejects.toThrow(/permission denied/);
    await db.query(
      `insert into public.subscriptions (user_id, provider, provider_subscription_id, status, current_period_end) values ($1, 'stripe', 'sub_alice', 'active', now() + interval '20 days')`,
      [alice],
    );
    const res = await as(db, { role: "authenticated", userId: alice }, (q) => q(`select public.has_premium($1) as p`, [alice]));
    expect(res.rows[0].p).toBe(true);
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) => q(`update public.subscriptions set status = 'active'`)),
    ).rejects.toThrow(/permission denied/);
  });

  it("consent can be withdrawn but not deleted or re-activated", async () => {
    await as(db, { role: "authenticated", userId: alice }, async (q) => {
      const upd = await q(`update public.consent_records set withdrawn_at = now() where purpose = 'cloud_storage_health_data'`);
      expect(upd.rowCount).toBe(1);
      await expect(q(`delete from public.consent_records`)).rejects.toThrow(/permission denied/);
    });
    await as(
      db,
      { role: "authenticated", userId: bob },
      async (q) => {
        await q(`update public.consent_records set withdrawn_at = now() where purpose = 'cloud_storage_health_data'`);
      },
      { commit: true },
    );
    await expect(
      as(db, { role: "authenticated", userId: bob }, (q) =>
        q(`update public.consent_records set withdrawn_at = null where purpose = 'cloud_storage_health_data'`),
      ),
    ).resolves.toMatchObject({ rowCount: 0 }); // policy filters withdrawn rows out → nothing re-activated
    const r = await db.query(
      `select count(*)::int n from public.consent_records where user_id = $1 and purpose = 'cloud_storage_health_data' and withdrawn_at is null`,
      [bob],
    );
    expect(r.rows[0].n).toBe(0);
  });
});

describe("administrators", () => {
  let admin: string;
  let analyst: string;

  beforeAll(async () => {
    admin = await createUser(db);
    analyst = await createUser(db);
    await db.query(`insert into public.admin_roles (user_id, role) values ($1, 'super_admin'), ($2, 'analyst')`, [admin, analyst]);
  });

  it.each(OWNER_TABLES)("super_admin cannot read individual %s", async (table) => {
    const rows = await as(db, { role: "authenticated", userId: admin }, (q) => q(`select * from public.${table}`));
    expect(rows.rowCount).toBe(0);
  });

  it("only content admins can edit the help directory", async () => {
    await as(db, { role: "authenticated", userId: alice }, async (q) => {
      const r = await q(`update public.support_resources set description = 'x' where id = 'ambulanse-113'`);
      expect(r.rowCount).toBe(0);
    });
    await as(db, { role: "authenticated", userId: admin }, async (q) => {
      const r = await q(`update public.support_resources set description = 'oppdatert' where id = 'ambulanse-113'`);
      expect(r.rowCount).toBe(1);
    });
  });

  it("aggregate stats require the analyst role, suppress small groups and are audited", async () => {
    await expect(as(db, { role: "authenticated", userId: alice }, (q) => q(`select public.admin_aggregate_stats()`))).rejects.toThrow(
      /forbidden/,
    );
    const res = await as(
      db,
      { role: "authenticated", userId: analyst },
      (q) => q(`select public.admin_aggregate_stats() as s`),
      { commit: true },
    );
    const stats = res.rows[0].s;
    expect(stats.suppressionThreshold).toBe(10);
    expect(stats.profilesTotal).toBeNull(); // < 10 profiles → suppressed
    expect(stats.substanceDistribution.crack_cocaine).toBeNull();
    const audit = await db.query(`select actor_id from public.audit_events where action = 'admin_aggregate_stats_viewed'`);
    expect(audit.rows.map((r) => r.actor_id)).toContain(analyst);
  });

  it("only super_admin can grant roles, and grants are audited", async () => {
    await expect(
      as(db, { role: "authenticated", userId: analyst }, (q) => q(`select public.grant_admin_role($1, 'moderator')`, [alice])),
    ).rejects.toThrow(/forbidden/);
    await as(db, { role: "authenticated", userId: admin }, async (q) => {
      await q(`select public.grant_admin_role($1, 'moderator')`, [bob]);
      const a = await q(`select action from public.audit_events where action = 'admin_role_granted'`);
      expect(a.rowCount).toBe(1);
    });
  });

  it("regular users cannot read or write the audit log or admin roles of others", async () => {
    await as(db, { role: "authenticated", userId: alice }, async (q) => {
      expect((await q(`select * from public.audit_events`)).rowCount).toBe(0);
      expect((await q(`select * from public.admin_roles`)).rowCount).toBe(0);
      await expect(q(`insert into public.audit_events (action) values ('x')`)).rejects.toThrow(/permission denied/);
    });
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) => q(`insert into public.admin_roles (user_id, role) values ($1, 'super_admin')`, [alice])),
    ).rejects.toThrow(/permission denied/);
  });
});

describe("community is closed until the moderation review", () => {
  it("nothing can be posted or read while the flag is off", async () => {
    await expect(
      as(db, { role: "authenticated", userId: alice }, (q) =>
        q(`insert into public.community_posts (author_id, topic, body) values ($1, 'general', 'hei')`, [alice]),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("when enabled, posts enter moderation as pending and cannot self-publish", async () => {
    await db.query("begin");
    try {
      await db.query(`update public.app_settings set value = 'true' where key = 'community_enabled'`);
      await db.query(`set local role authenticated`);
      await db.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: alice })]);
      await db.query(`insert into public.community_posts (author_id, topic, body) values ($1, 'general', 'hei')`, [alice]);
      await db.query("savepoint s1");
      await expect(
        db.query(`insert into public.community_posts (author_id, topic, body, status) values ($1, 'general', 'x', 'published')`, [alice]),
      ).rejects.toThrow(/row-level security/);
      await db.query("rollback to savepoint s1");
      // Bob cannot see Alice's pending post
      await db.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: bob })]);
      const visible = await db.query(`select * from public.community_posts`);
      expect(visible.rowCount).toBe(0);
    } finally {
      await db.query("rollback");
    }
  });
});

describe("data rights", () => {
  it("export_my_data returns only the caller's data", async () => {
    const res = await as(db, { role: "authenticated", userId: alice }, (q) => q(`select public.export_my_data() as d`));
    const d = res.rows[0].d;
    expect(d.profile.id).toBe(alice);
    expect(d.journal).toHaveLength(1);
    expect(d.aiMessages).toHaveLength(1);
    const owners = [...d.checkins, ...d.journal, ...d.aiMessages, ...d.substances].map((r: { user_id: string }) => r.user_id);
    expect(new Set(owners)).toEqual(new Set([alice]));
    expect(d.notificationPreferences.expo_push_token).toBeUndefined();
  });

  it("export requires authentication", async () => {
    await expect(as(db, { role: "anon" }, (q) => q(`select public.export_my_data()`))).rejects.toThrow(/permission denied/);
  });

  it("delete_my_account erases every row belonging to the user and nothing else", async () => {
    const dave = await createUser(db);
    await seedUserData(dave);
    await as(db, { role: "authenticated", userId: dave }, (q) => q(`select public.delete_my_account()`), { commit: true });

    for (const [table, col] of OWNER_TABLES) {
      const r = await db.query(`select count(*)::int n from public.${table} where ${col} = $1`, [dave]);
      expect(r.rows[0].n, table).toBe(0);
    }
    const user = await db.query(`select count(*)::int n from auth.users where id = $1`, [dave]);
    expect(user.rows[0].n).toBe(0);
    const aliceStill = await db.query(`select count(*)::int n from public.journal_entries where user_id = $1`, [alice]);
    expect(aliceStill.rows[0].n).toBe(1);
    const audit = await db.query(`select actor_id, target_id from public.audit_events where action = 'account_deleted'`);
    expect(audit.rows).toEqual([{ actor_id: null, target_id: null }]);
  });
});

describe("Phase 3 constraints and consent", () => {
  it("AI messages can only be written with an active ai_coach consent", async () => {
    const erin = await createUser(db);
    await expect(
      as(db, { role: "authenticated", userId: erin }, (q) => q(`insert into public.ai_conversations (user_id) values ($1)`, [erin])),
    ).rejects.toThrow(/row-level security/);
    // grant → allowed; withdraw → blocked again, but existing messages stay readable/deletable
    await as(
      db,
      { role: "authenticated", userId: erin },
      async (q) => {
        await q(`insert into public.consent_records (user_id, purpose, policy_version) values ($1, 'ai_coach', '2026-10-ai-v1')`, [erin]);
        const c = await q(`insert into public.ai_conversations (user_id) values ($1) returning id`, [erin]);
        await q(`insert into public.ai_messages (conversation_id, user_id, role, content) values ($1, $2, 'user', 'hei')`, [c.rows[0].id, erin]);
        await q(`update public.consent_records set withdrawn_at = now() where user_id = $1 and purpose = 'ai_coach'`, [erin]);
      },
      { commit: true },
    );
    await as(db, { role: "authenticated", userId: erin }, async (q) => {
      expect((await q(`select * from public.ai_messages`)).rowCount).toBe(1);
      const conv = await q(`select id from public.ai_conversations`);
      await expect(
        q(`insert into public.ai_messages (conversation_id, user_id, role, content) values ($1, $2, 'user', 'igjen')`, [conv.rows[0].id, erin]),
      ).rejects.toThrow(/row-level security/);
    });
    await as(db, { role: "authenticated", userId: erin }, async (q) => {
      expect((await q(`delete from public.ai_messages`)).rowCount).toBe(1);
    });
  });

  it("AI messages are immutable once written", async () => {
    await as(db, { role: "authenticated", userId: alice }, async (q) => {
      const r = await q(`update public.ai_messages set content = 'endret'`);
      expect(r.rowCount).toBe(0);
    });
  });

  it("cannot link a craving event to another user's trigger", async () => {
    const bobTrigger = (await db.query(`select id from public.personal_triggers where user_id = $1 and kind is not null`, [bob])).rows[0].id;
    await expect(
      as(db, { role: "authenticated", userId: alice }, async (q) => {
        const ev = await q(`insert into public.craving_events (user_id, started_at) values ($1, now()) returning id`, [alice]);
        await q(`insert into public.craving_event_triggers (craving_event_id, trigger_id, user_id) values ($1, $2, $3)`, [ev.rows[0].id, bobTrigger, alice]);
      }),
    ).rejects.toThrow(/foreign key/);
  });

  it("enforces journal mood 1–10, known emotions and max 10 tags", async () => {
    const run = (sql: string) => as(db, { role: "authenticated", userId: alice }, (q) => q(sql, [alice]));
    await expect(run(`insert into public.journal_entries (user_id, entry_date, mood) values ($1, current_date, 11)`)).rejects.toThrow(/check constraint/);
    await expect(run(`insert into public.journal_entries (user_id, entry_date, emotions) values ($1, current_date, '{euphoric}')`)).rejects.toThrow(/check constraint/);
    await expect(
      run(`insert into public.journal_entries (user_id, entry_date, tags) values ($1, current_date, '{a,b,c,d,e,f,g,h,i,j,k}')`),
    ).rejects.toThrow(/check constraint/);
    await expect(run(`insert into public.journal_entries (user_id, entry_date, mood) values ($1, current_date, 10)`)).resolves.toBeDefined();
  });

  it("weekly goals must start on a Monday; triggers need a preset or label and locations have no coordinates", async () => {
    const run = (sql: string) => as(db, { role: "authenticated", userId: alice }, (q) => q(sql, [alice]));
    await expect(
      run(`insert into public.weekly_goals (user_id, week_start, title, target) values ($1, date_trunc('week', now())::date + 2, 'x', 1)`),
    ).rejects.toThrow(/check constraint/);
    await expect(run(`insert into public.personal_triggers (user_id, kind) values ($1, 'custom')`)).rejects.toThrow(/check constraint/);
    await expect(run(`insert into public.personal_triggers (user_id, kind, preset_key) values ($1, 'location', 'home')`)).rejects.toThrow(/check constraint/);
    const cols = await db.query(`select column_name from information_schema.columns where table_name = 'personal_triggers'`);
    expect(cols.rows.map((r) => r.column_name).filter((c: string) => /lat|lon|geo|coord|gps/.test(c))).toEqual([]);
  });

  it("article ids are validated and recurrence needs weekdays", async () => {
    const run = (sql: string) => as(db, { role: "authenticated", userId: alice }, (q) => q(sql, [alice]));
    await expect(run(`insert into public.article_activity (user_id, article_id) values ($1, '../etc/passwd')`)).rejects.toThrow(/check constraint/);
    await expect(
      run(`insert into public.recovery_tasks (user_id, title, recurrence) values ($1, 'x', 'weekly')`),
    ).rejects.toThrow(/check constraint/);
  });

  it("export includes Phase 3 data", async () => {
    const res = await as(db, { role: "authenticated", userId: alice }, (q) => q(`select public.export_my_data() as d`));
    const d = res.rows[0].d;
    expect(d.formatVersion).toBe(2);
    for (const key of ["cravingEventTriggers", "copingStrategies", "taskCompletions", "weeklyGoals", "articleActivity"]) {
      expect(d[key].length, key).toBeGreaterThan(0);
    }
    expect(d.personalRecoveryPlan.content.reasons).toBe("barna");
    expect(d.journal[0].is_important).toBe(true);
  });
});
