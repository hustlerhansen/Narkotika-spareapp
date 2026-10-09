import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { EDUCATION_CATEGORIES, articlesInCategory, readingMinutes, type EducationCategoryId } from "@nystart/core";
import { PageHeader } from "@/components/ui/Card";
import { t } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return EDUCATION_CATEGORIES.map((c) => ({ categoryId: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string }> }): Promise<Metadata> {
  const { categoryId } = await params;
  return { title: EDUCATION_CATEGORIES.find((c) => c.id === categoryId)?.title ?? t.t("learn.title") };
}

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const category = EDUCATION_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) notFound();
  const articles = articlesInCategory(category.id as EducationCategoryId);
  return (
    <div className="flex flex-col gap-5">
      <Link href="/laer" className="text-sm font-semibold text-primary underline">
        {t.t("learn.back")}
      </Link>
      <PageHeader title={category.title} intro={category.description} />
      <ul className="flex flex-col gap-2">
        {articles.map((a) => (
          <li key={a.id}>
            <Link href={`/laer/${a.id}`} className="tap flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4 hover:bg-surface-2">
              <span className="font-semibold">{a.title}</span>
              <span className="line-clamp-2 text-sm text-muted">{a.intro}</span>
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <Clock aria-hidden="true" size={12} /> {t.tp("learn.readingTime", readingMinutes(a))} · {t.tDynamic(`learn.review.${a.review.status}`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
