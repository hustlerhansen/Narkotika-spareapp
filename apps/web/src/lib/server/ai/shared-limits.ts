import "server-only";
import { createHmac } from "node:crypto";

/**
 * Rate limiting and daily budget shared by all server instances (R-23),
 * backed by the `ai_take` Postgres function (service role only).
 *
 * - The client key (e.g. IP address) is replaced by an HMAC with a server secret
 *   before it leaves the process: the database never stores raw identifiers.
 * - Fail closed: if the store cannot be reached, the request is refused.
 */
export type AiTakeRpc = (args: { p_subject: string; p_scope: "minute" | "day"; p_limit: number }) => Promise<{ data: unknown; error: unknown }>;

export function subjectHash(clientKey: string, salt: string): string {
  return createHmac("sha256", salt).update(clientKey).digest("hex");
}

async function take(rpc: AiTakeRpc, p_subject: string, p_scope: "minute" | "day", p_limit: number): Promise<boolean> {
  try {
    const { data, error } = await rpc({ p_subject, p_scope, p_limit });
    return !error && data === true;
  } catch {
    return false;
  }
}

export class SharedRateLimiter {
  constructor(
    private readonly rpc: AiTakeRpc,
    private readonly perMinute: number,
    private readonly perDay: number,
    private readonly salt: string,
  ) {}

  async take(clientKey: string): Promise<boolean> {
    const subject = subjectHash(clientKey, this.salt);
    if (!(await take(this.rpc, subject, "minute", this.perMinute))) return false;
    return take(this.rpc, subject, "day", this.perDay);
  }
}

export class SharedDailyBudget {
  constructor(
    private readonly rpc: AiTakeRpc,
    private readonly max: number,
  ) {}

  take(): Promise<boolean> {
    return take(this.rpc, "global", "day", this.max);
  }
}
