import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

export function Card({ className, ...rest }: ComponentProps<"section">) {
  return <section className={cx("rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]", className)} {...rest} />;
}

export function CardTitle({ children, as: Tag = "h2", className }: { children: ReactNode; as?: "h2" | "h3"; className?: string }) {
  return <Tag className={cx("text-lg font-semibold text-text", className)}>{children}</Tag>;
}

export function PageHeader({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <header className="mb-5">
      <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">{title}</h1>
      {intro && <p className="mt-2 text-muted">{intro}</p>}
    </header>
  );
}
