import type { ReactNode } from "react";
import { cx } from "./cx";

/** Safety / warning callout. `role="note"` so it is announced as supplementary content. */
export function Notice({ title, children, tone = "warning", className }: { title: string; children: ReactNode; tone?: "warning" | "danger" | "info"; className?: string }) {
  return (
    <div
      role="note"
      className={cx(
        "rounded-2xl border-l-4 p-4",
        tone === "danger" && "border-danger bg-danger-soft",
        tone === "warning" && "border-warning-border bg-warning-soft",
        tone === "info" && "border-primary bg-surface-2",
        className,
      )}
    >
      <p className="font-semibold text-text">{title}</p>
      <div className="mt-1 text-text">{children}</div>
    </div>
  );
}
