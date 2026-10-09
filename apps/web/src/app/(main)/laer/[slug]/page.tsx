import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ExternalLink, Phone, ShieldAlert, TriangleAlert } from "lucide-react";
import { SUPPORT_RESOURCES, allArticles, articleById, categoryById, readingMinutes, sourceById, telHref } from "@nystart/core";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { t } from "@/lib/i18n";
import { ArticleTools } from "./ArticleTools";

export const dynamicParams = false;

export function generateStaticParams() {
  return allArticles().map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleById(slug);
  return { title: a?.title ?? t.t("learn.notFound"), description: a?.intro };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleById(slug);
  if (!article) notFound();
  const category = categoryById(article.categoryId);
  const related = article.relatedIds.map((id) => articleById(id)).filter((a) => a !== undefined);
  const resources = article.helpResourceIds.map((id) => SUPPORT_RESOURCES.find((r) => r.id === id)).filter((r) => r !== undefined);
  const sources = article.sourceIds.map((id) => sourceById(id)).filter((s) => s !== undefined);
  const approved = article.review.status === "approved";

  return (
    <article className="flex flex-col gap-5" aria-labelledby="article-title">
      <nav aria-label="Brødsmuler" className="text-sm">
        <Link href="/laer" className="font-semibold text-primary underline">
          {t.t("learn.title")}
        </Link>
        <span aria-hidden="true"> › </span>
        <Link href={`/laer/kategori/${category.id}`} className="font-semibold text-primary underline">
          {category.title}
        </Link>
      </nav>
      <header className="flex flex-col gap-3">
        <h1 id="article-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
          {article.title}
        </h1>
        <p className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" size={14} /> {t.tp("learn.readingTime", readingMinutes(article))}
          </span>
          <span>{t.t("learn.updatedOn", { date: t.formatDate(new Date(`${article.updatedOn}T12:00:00`), "medium") })}</span>
        </p>
        <p
          className={
            approved
              ? "inline-flex items-center gap-2 self-start rounded-full bg-surface-2 px-3 py-1 text-sm font-medium"
              : "inline-flex items-center gap-2 self-start rounded-full border border-warning-border bg-warning-soft px-3 py-1 text-sm font-medium"
          }
          data-review-status={article.review.status}
        >
          <ShieldAlert aria-hidden="true" size={16} /> {t.tDynamic(`learn.review.${article.review.status}`)}
          {approved && article.review.lastReviewedOn && ` · ${t.t("learn.reviewedOn", { date: article.review.lastReviewedOn })}`}
        </p>
        <ArticleTools articleId={article.id} />
      </header>

      {!approved && <p className="rounded-xl bg-surface-2 p-3 text-sm">{t.t("learn.reviewNotice")}</p>}

      <p className="text-lg">{article.intro}</p>

      {article.safetyNote && (
        <Notice title={t.t("sos.emergencyTitle")} tone="danger">
          <span className="flex items-start gap-2">
            <TriangleAlert aria-hidden="true" size={18} className="mt-1 shrink-0 text-danger" />
            <span>{article.safetyNote}</span>
          </span>
        </Notice>
      )}

      <div id="article-body" className="flex flex-col gap-5 leading-relaxed">
        {article.sections.map((s, i) => (
          <section key={i} className="flex flex-col gap-2">
            {s.heading && <h2 className="text-xl font-semibold">{s.heading}</h2>}
            {s.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {s.bullets && (
              <ul className="flex list-disc flex-col gap-1 pl-6">
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t.t("learn.keyTakeaways")}</h2>
        <ul className="flex list-disc flex-col gap-1 pl-6">
          {article.keyTakeaways.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      </Card>

      {article.copingTips && article.copingTips.length > 0 && (
        <Card className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t.t("learn.copingTips")}</h2>
          <ul className="flex list-disc flex-col gap-1 pl-6">
            {article.copingTips.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </Card>
      )}

      <section aria-labelledby="help-title" className="flex flex-col gap-2">
        <h2 id="help-title" className="text-lg font-semibold">
          {t.t("learn.help")}
        </h2>
        <ul className="flex flex-col gap-2">
          {resources.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface p-3">
              <span className="font-medium">{r.name}</span>
              {r.phone ? (
                <a href={telHref(r.phone)} className="tap inline-flex items-center gap-1 rounded-full px-3 font-semibold text-primary underline">
                  <Phone aria-hidden="true" size={16} /> {r.phone}
                </a>
              ) : r.website ? (
                <a href={r.website} target="_blank" rel="noopener noreferrer" className="tap inline-flex items-center gap-1 px-3 font-semibold text-primary underline">
                  <ExternalLink aria-hidden="true" size={16} /> {t.t("help.website")}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
        <Link href="/sos" className="text-sm font-semibold text-danger underline">
          {t.t("sosButton.label")}
        </Link>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="flex flex-col gap-2">
          <h2 id="related-title" className="text-lg font-semibold">
            {t.t("learn.related")}
          </h2>
          <ul className="flex flex-col gap-2">
            {related.map((a) => (
              <li key={a.id}>
                <Link href={`/laer/${a.id}`} className="tap flex items-center rounded-xl border border-border bg-surface p-3 font-medium text-primary hover:bg-surface-2">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="sources-title" className="flex flex-col gap-2 text-sm">
        <h2 id="sources-title" className="text-base font-semibold">
          {t.t("learn.sources")}
        </h2>
        <ul className="flex flex-col gap-1">
          {sources.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                {s.title}
              </a>{" "}
              <span className="text-muted">– {s.publisher}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted">{t.t("learn.sourcesNote")}</p>
      </section>
    </article>
  );
}
