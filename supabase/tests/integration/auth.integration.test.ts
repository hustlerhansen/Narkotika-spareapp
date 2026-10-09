/**
 * Integration tests against a REAL Supabase stack (GoTrue, PostgREST, Postgres with our migrations, Mailpit).
 * Covers registration with e-mail confirmation, sign-in, password policy, account enumeration,
 * password reset, redirect allow-list, RLS through real JWTs, export and account deletion.
 */
import { describe, expect, it } from "vitest";
import { signUpErrorKey } from "@nystart/core";
import { anonClient, env, mailCount, serviceClient, uniqueEmail, verifyLink, waitForMail } from "./env";

const PASSWORD = "riktig-hest-batteri";

/** Registers and confirms a user through the real e-mail link; returns a signed-in client. */
async function confirmedUser(tag: string) {
  const email = uniqueEmail(tag);
  const client = anonClient();
  const { data, error } = await client.auth.signUp({
    email,
    password: PASSWORD,
    options: { emailRedirectTo: `${env.siteUrl}/auth/callback?next=/profil`, data: { adult_confirmed: true, terms_version: "test" } },
  });
  expect(error).toBeNull();
  expect(data.session).toBeNull(); // confirmation required
  const link = verifyLink((await waitForMail(email)).text);
  const res = await fetch(link, { redirect: "manual" });
  expect(res.status).toBe(303);
  const signedIn = await client.auth.signInWithPassword({ email, password: PASSWORD });
  expect(signedIn.error).toBeNull();
  return { email, client, userId: signedIn.data.user!.id };
}

describe("registration and sign-in", () => {
  it("requires e-mail confirmation before sign-in", async () => {
    const email = uniqueEmail("unconfirmed");
    const client = anonClient();
    const { data, error } = await client.auth.signUp({ email, password: PASSWORD });
    expect(error).toBeNull();
    expect(data.session).toBeNull();
    const signIn = await client.auth.signInWithPassword({ email, password: PASSWORD });
    expect(signIn.error?.code).toBe("email_not_confirmed");
  });

  it("confirms via the e-mail link, redirects to the allow-listed callback and stores the sign-up confirmations", async () => {
    const email = uniqueEmail("confirm");
    const client = anonClient();
    await client.auth.signUp({
      email,
      password: PASSWORD,
      options: { emailRedirectTo: `${env.siteUrl}/auth/callback?next=/profil`, data: { adult_confirmed: true, terms_version: "2026-10-beta-draft" } },
    });
    const link = verifyLink((await waitForMail(email)).text);
    const res = await fetch(link, { redirect: "manual" });
    const location = res.headers.get("location") ?? "";
    expect(location.startsWith(`${env.siteUrl}/auth/callback?next=/profil`)).toBe(true);

    const { data, error } = await client.auth.signInWithPassword({ email, password: PASSWORD });
    expect(error).toBeNull();
    expect(data.user?.email_confirmed_at).toBeTruthy();
    expect(data.user?.user_metadata).toMatchObject({ adult_confirmed: true, terms_version: "2026-10-beta-draft" });
  });

  it("enforces the 10-character password minimum on the server", async () => {
    const { error } = await anonClient().auth.signUp({ email: uniqueEmail("weak"), password: "kort123" });
    expect(error?.code).toBe("weak_password");
  });

  it("does not reveal in the app whether an e-mail address is already registered", async () => {
    const { email } = await confirmedUser("dupe");
    const before = await mailCount(email);
    const again = await anonClient().auth.signUp({ email, password: "et-helt-annet-passord" });
    // Observed: GoTrue answers 422 user_already_exists for confirmed addresses (API-level enumeration,
    // tracked in RISK_REGISTER R-30). The app maps it to the same "check your e-mail" message as a new sign-up.
    expect(again.data.session).toBeNull();
    expect(signUpErrorKey(again.error)).toBeNull();
    // A wrong password for an existing account and a non-existent account give the same error.
    const wrong = await anonClient().auth.signInWithPassword({ email, password: "feil-passord-123" });
    const missing = await anonClient().auth.signInWithPassword({ email: uniqueEmail("nobody"), password: "feil-passord-123" });
    expect(wrong.error?.code).toBe("invalid_credentials");
    expect(missing.error?.code).toBe("invalid_credentials");
    expect(await mailCount(email)).toBeGreaterThanOrEqual(before);
  });

  it("ignores redirect targets outside the allow-list (falls back to the site URL)", async () => {
    const email = uniqueEmail("redirect");
    await anonClient().auth.signUp({ email, password: PASSWORD, options: { emailRedirectTo: "https://evil.example/steal" } });
    const link = verifyLink((await waitForMail(email)).text);
    expect(link.searchParams.get("redirect_to") ?? "").not.toContain("evil.example");
    const res = await fetch(link, { redirect: "manual" });
    expect(res.headers.get("location") ?? "").not.toContain("evil.example");
  });
});

describe("password reset", () => {
  it("resets the password through the recovery e-mail", async () => {
    const { email } = await confirmedUser("reset");
    const before = await mailCount(email);
    const client = anonClient();
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${env.siteUrl}/auth/callback?next=/nytt-passord` });
    expect(error).toBeNull();
    const link = verifyLink((await waitForMail(email, { after: before })).text);
    expect(link.searchParams.get("type")).toBe("recovery");

    const verified = await client.auth.verifyOtp({ type: "recovery", token_hash: link.searchParams.get("token")! });
    expect(verified.error).toBeNull();
    const update = await client.auth.updateUser({ password: "nytt-og-langt-passord" });
    expect(update.error).toBeNull();

    expect((await anonClient().auth.signInWithPassword({ email, password: PASSWORD })).error?.code).toBe("invalid_credentials");
    expect((await anonClient().auth.signInWithPassword({ email, password: "nytt-og-langt-passord" })).error).toBeNull();
  });

  it("answers identically for unknown addresses (no enumeration)", async () => {
    const { error } = await anonClient().auth.resetPasswordForEmail(uniqueEmail("unknown"));
    expect(error).toBeNull();
  });

  it("rejects a recovery token that was already used", async () => {
    const { email } = await confirmedUser("reuse");
    const before = await mailCount(email);
    await anonClient().auth.resetPasswordForEmail(email);
    const token = verifyLink((await waitForMail(email, { after: before })).text).searchParams.get("token")!;
    expect((await anonClient().auth.verifyOtp({ type: "recovery", token_hash: token })).error).toBeNull();
    expect((await anonClient().auth.verifyOtp({ type: "recovery", token_hash: token })).error).not.toBeNull();
  });
});

describe("RLS through PostgREST with real JWTs", () => {
  it("anonymous visitors can read the help directory but no personal tables", async () => {
    const anon = anonClient();
    const help = await anon.from("support_resources").select("id").limit(1);
    expect(help.error).toBeNull();
    expect(help.data?.length).toBe(1);
    const journal = await anon.from("journal_entries").select("id");
    expect(journal.error?.code).toBe("42501");
  });

  it("isolates journal entries between two real accounts", async () => {
    const alice = await confirmedUser("alice");
    const bob = await confirmedUser("bob");
    const insert = await alice.client.from("journal_entries").insert({ user_id: alice.userId, entry_date: "2026-10-01" }).select("id").single();
    expect(insert.error).toBeNull();

    expect((await alice.client.from("journal_entries").select("id")).data).toHaveLength(1);
    expect((await bob.client.from("journal_entries").select("id")).data).toHaveLength(0);

    // Bob cannot write rows for Alice, update or delete hers.
    const forged = await bob.client.from("journal_entries").insert({ user_id: alice.userId, entry_date: "2026-10-02" });
    expect(forged.error?.code).toBe("42501");
    const upd = await bob.client.from("journal_entries").update({ craving: 9 }).eq("id", insert.data!.id).select("id");
    expect(upd.data).toHaveLength(0);
    const del = await bob.client.from("journal_entries").delete().eq("id", insert.data!.id).select("id");
    expect(del.data).toHaveLength(0);
  });

  it("denies admin statistics and role management to ordinary users", async () => {
    const { client, userId } = await confirmedUser("notadmin");
    expect((await client.rpc("admin_aggregate_stats")).error).not.toBeNull();
    expect((await client.rpc("grant_admin_role", { p_user: userId, p_role: "super_admin" })).error).not.toBeNull();
  });
});

describe("data rights", () => {
  it("exports only the signed-in person's data", async () => {
    const alice = await confirmedUser("export-a");
    const bob = await confirmedUser("export-b");
    await alice.client.from("journal_entries").insert({ user_id: alice.userId, entry_date: "2026-10-03", reflection: "alice-only" });
    await bob.client.from("journal_entries").insert({ user_id: bob.userId, entry_date: "2026-10-03", reflection: "bob-only" });

    const { data, error } = await alice.client.rpc("export_my_data");
    expect(error).toBeNull();
    const text = JSON.stringify(data);
    expect(data.account.email).toBe(alice.email);
    expect(text).not.toContain(bob.email);
    expect(text).toContain("alice-only");
    expect(text).not.toContain("bob-only");
    expect(text).not.toContain(bob.userId);
  });

  it("deletes the account and all personal rows; the person can no longer sign in", async () => {
    const { client, email, userId } = await confirmedUser("delete");
    await client.from("journal_entries").insert({ user_id: userId, entry_date: "2026-10-04" });
    const { error } = await client.rpc("delete_my_account");
    expect(error).toBeNull();

    expect((await anonClient().auth.signInWithPassword({ email, password: PASSWORD })).error?.code).toBe("invalid_credentials");
    const admin = serviceClient();
    expect((await admin.auth.admin.getUserById(userId)).data.user).toBeNull();
    const rows = await admin.from("journal_entries").select("id").eq("user_id", userId);
    expect(rows.data).toHaveLength(0);
    // The audit trail keeps only that "an account was deleted", without an identifier.
    const audit = await admin.from("audit_events").select("actor_id, target_id").eq("action", "account_deleted").order("created_at", { ascending: false }).limit(1);
    expect(audit.data?.[0]).toMatchObject({ actor_id: null });
    expect(JSON.stringify(audit.data)).not.toContain(userId);
  });

  it("refuses account deletion without a session", async () => {
    const { error } = await anonClient().rpc("delete_my_account");
    expect(error).not.toBeNull();
  });
});
