import type { ReactNode } from "react";
import { cx } from "./cx";

/** Large selectable card backed by a native checkbox/radio (keyboard + screen reader friendly). */
export function Choice({
  type,
  name,
  value,
  checked,
  onChange,
  title,
  description,
  badge,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <label
      className={cx(
        "tap flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-surface p-4 transition-colors",
        checked ? "border-primary bg-surface-2" : "border-border hover:border-muted",
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]"
      />
      <span className="flex flex-col">
        <span className="flex flex-wrap items-center gap-2 font-semibold text-text">
          {title}
          {badge}
        </span>
        {description && <span className="text-sm text-muted">{description}</span>}
      </span>
    </label>
  );
}
