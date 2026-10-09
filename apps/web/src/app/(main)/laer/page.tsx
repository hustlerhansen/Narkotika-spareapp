import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { EDUCATION_CATEGORIES, articlesInCategory } from "@nystart/core";
import { PageHeader } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { LearnHome } from "./LearnHome";

export const metadata: Metadata = { title: "Kunnskapssenter" };

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.t("learn.title")} intro={t.t("learn.subtitle")} />
      <LearnHome />
      <section aria-labelledby="categories-title" className="flex flex-col gap-3">
        <h2 id="categories-title" className="text-lg font-semibold">
          {t.t("learn.categories")}
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {EDUCATION_CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/laer/kategori/${c.id}`}
                className={
                  c.id === "crack-og-kokain"
                    ? "tap hero-gradient flex h-full flex-col gap-1 rounded-[var(--radius-card)] p-5"
                    : "tap flex h-full flex-col gap-1 rounded-[var(--radius-card)] border border-border bg-surface p-5 hover:bg-surface-2"
                }
              >
                <span className="text-lg font-semibold">{c.title}</span>
                <span className={c.id === "crack-og-kokain" ? "text-on-hero-muted" : "text-muted"}>{c.description}</span>
                <span className={c.id === "crack-og-kokain" ? "text-sm text-accent" : "text-sm text-muted"}>
                  {t.tp("learn.articles", articlesInCategory(c.id).length)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="flex items-start gap-2 text-sm text-muted">
        <WifiOff aria-hidden="true" size={16} className="mt-0.5 shrink-0" /> {t.t("learn.offlineHint")}
      </p>
    </div>
  );
}
