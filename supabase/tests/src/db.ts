import { inject } from "vitest";
import pg from "pg";
import { randomUUID } from "node:crypto";

export function connect(): pg.Client {
  const { host, port } = inject("pg");
  return new pg.Client({ host, port, user: "postgres", database: "postgres" });
}

/** Creates an auth user (as the platform would on sign-up) and returns its id. */
export async function createUser(admin: pg.Client, email = `${randomUUID()}@test.local`): Promise<string> {
  const id = randomUUID();
  await admin.query("insert into auth.users (id, email) values ($1, $2)", [id, email]);
  return id;
}

/**
 * Runs `fn` inside a transaction as the given role/user, exactly like
 * PostgREST does for a request carrying that user's JWT. Always rolled back
 * unless `commit` is set.
 */
export async function as<T>(
  client: pg.Client,
  who: { role: "anon" | "authenticated" | "service_role"; userId?: string },
  fn: (q: (sql: string, params?: unknown[]) => Promise<pg.QueryResult>) => Promise<T>,
  opts: { commit?: boolean } = {},
): Promise<T> {
  await client.query("begin");
  try {
    await client.query(`set local role ${who.role}`);
    await client.query("select set_config('request.jwt.claims', $1, true)", [
      JSON.stringify(who.userId ? { sub: who.userId, role: who.role } : { role: who.role }),
    ]);
    const result = await fn((sql, params) => client.query(sql, params as unknown[]));
    await client.query(opts.commit ? "commit" : "rollback");
    return result;
  } catch (e) {
    await client.query("rollback");
    throw e;
  }
}
