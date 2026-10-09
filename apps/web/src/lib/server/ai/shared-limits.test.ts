// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { SharedDailyBudget, SharedRateLimiter, subjectHash, type AiTakeRpc } from "./shared-limits";

/** In-memory stand-in for the ai_take() SQL function. */
function fakeRpc() {
  const counts = new Map<string, number>();
  const calls: { p_subject: string; p_scope: string; p_limit: number }[] = [];
  const rpc: AiTakeRpc = async (args) => {
    calls.push(args);
    const key = `${args.p_subject}:${args.p_scope}`;
    const n = counts.get(key) ?? 0;
    if (args.p_limit <= 0 || n >= args.p_limit) return { data: false, error: null };
    counts.set(key, n + 1);
    return { data: true, error: null };
  };
  return { rpc, calls };
}

const SALT = "s".repeat(32);

describe("shared AI limits", () => {
  it("never sends the raw client key – only an HMAC", async () => {
    const { rpc, calls } = fakeRpc();
    await new SharedRateLimiter(rpc, 5, 10, SALT).take("203.0.113.7");
    expect(calls.every((c) => !c.p_subject.includes("203.0.113.7"))).toBe(true);
    expect(calls[0]!.p_subject).toBe(subjectHash("203.0.113.7", SALT));
    expect(calls[0]!.p_subject).toMatch(/^[a-f0-9]{64}$/);
  });

  it("enforces per-minute and per-day limits per subject", async () => {
    const { rpc } = fakeRpc();
    const limiter = new SharedRateLimiter(rpc, 2, 100, SALT);
    expect([await limiter.take("a"), await limiter.take("a"), await limiter.take("a"), await limiter.take("b")]).toEqual([true, true, false, true]);
    const daily = new SharedRateLimiter(fakeRpc().rpc, 100, 1, SALT);
    expect([await daily.take("a"), await daily.take("a")]).toEqual([true, false]);
  });

  it("fails closed when the store errors or is unreachable", async () => {
    const erroring: AiTakeRpc = async () => ({ data: null, error: { message: "boom" } });
    const throwing: AiTakeRpc = async () => {
      throw new Error("network");
    };
    expect(await new SharedRateLimiter(erroring, 5, 5, SALT).take("a")).toBe(false);
    expect(await new SharedRateLimiter(throwing, 5, 5, SALT).take("a")).toBe(false);
    expect(await new SharedDailyBudget(throwing, 5).take()).toBe(false);
  });

  it("global daily budget", async () => {
    const budget = new SharedDailyBudget(fakeRpc().rpc, 2);
    expect([await budget.take(), await budget.take(), await budget.take()]).toEqual([true, true, false]);
  });
});
