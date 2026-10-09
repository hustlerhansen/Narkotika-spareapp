/**
 * Token-bucket rate limiter (pure, injectable clock).
 * NOTE: an in-memory limiter only protects a single server instance. Before
 * enabling AI in production, back it with a shared store (R-23).
 */
export class RateLimiter {
  private buckets = new Map<string, { tokens: number; updated: number }>();

  constructor(
    private readonly capacity: number,
    private readonly refillPerMs: number,
    private readonly now: () => number = Date.now,
    private readonly maxKeys = 10_000,
  ) {}

  /** Returns true if the request is allowed (and consumes a token). */
  take(key: string): boolean {
    const t = this.now();
    const b = this.buckets.get(key) ?? { tokens: this.capacity, updated: t };
    b.tokens = Math.min(this.capacity, b.tokens + (t - b.updated) * this.refillPerMs);
    b.updated = t;
    if (this.buckets.size >= this.maxKeys && !this.buckets.has(key)) this.buckets.clear();
    this.buckets.set(key, b);
    if (b.tokens < 1) return false;
    b.tokens -= 1;
    return true;
  }
}

/** Simple daily counter for cost control (global cap on model calls). */
export class DailyBudget {
  private day = "";
  private used = 0;
  constructor(private readonly max: number, private readonly now: () => Date = () => new Date()) {}
  take(): boolean {
    const d = this.now().toISOString().slice(0, 10);
    if (d !== this.day) {
      this.day = d;
      this.used = 0;
    }
    if (this.used >= this.max) return false;
    this.used++;
    return true;
  }
}
