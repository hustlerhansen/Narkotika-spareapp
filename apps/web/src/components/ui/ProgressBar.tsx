export function ProgressBar({ value, label, tone = "primary" }: { value: number; label: string; tone?: "primary" | "accent" }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-3 w-full overflow-hidden rounded-full bg-surface-2 border border-border"
    >
      <div
        className={tone === "accent" ? "h-full rounded-full bg-accent" : "h-full rounded-full bg-primary"}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
