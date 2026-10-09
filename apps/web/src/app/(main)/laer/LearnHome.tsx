"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Clock } from "lucide-react";
import { articleById, readingMinutes, recentlyRead, searchArticles, type Article } from "@nystart/core";
import { Card } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function ArticleLink({ article, progress }: { article: Article; progress?: number }) {
  const t = useT();
  return (
    <Link href={`/laer/${article.id}`} className="tap flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4 hover:bg-surface-2">
      <span className="font-semibold">{article.title}</span>
      <span className="line-clamp-2 text-sm text-muted">{article.intro}</span>
      <span className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Clock aria-hidden="true" size={12} /> {t.tp("learn.readingTime", readingMinutes(article))}
        </span>
        {progress !== undefined && progress > 0 && <span>{t.t("learn.progress", { percent: Math.round(progress * 100) })}</span>}
      </span>
    </Link>
  );
}

/** Client part of the Kunnskapssenter front page: search, bookmarks, recently read. */
export function LearnHome() {
  const t = useT();
  const { state, status } = useStore();
  const [query, setQuery] = useState("");
  const hits = useMemo(() => (query.trim().length > 1 ? searchArticles(query) : null), [query]);
  const progressOf = (id: string) => state.education.reading.find((r) => r.articleId === id)?.progress;
  const bookmarks = state.education.bookmarks.map((id) => articleById(id)).filter(Boolean) as Article[];
  const recent = recentlyRead(state, 3)
    .map((r) => articleById(r.articleId))
    .filter(Boolean) as Article[];

  return (
    <div className="flex flex-col gap-5">
      <Field label={t.t("learn.search")}>
        {(p) => <TextInput {...p} type="search" value={query} onChange={(e) => setQuery(e.target.value)} />}
      </Field>
      {hits && (
        <section aria-labelledby="search-results" className="flex flex-col gap-3">
          <h2 id="search-results" className="text-lg font-semibold" aria-live="polite">
            {t.tp("learn.searchResults", hits.length)}
          </h2>
          {hits.length === 0 ? (
            <p className="text-muted">{t.t("learn.noResults")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {hits.slice(0, 20).map((h) => (
                <li key={h.article.id}>
                  <ArticleLink article={h.article} progress={progressOf(h.article.id)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {status !== "loading" && !hits && recent.length > 0 && (
        <section aria-labelledby="recent-title" className="flex flex-col gap-2">
          <h2 id="recent-title" className="text-lg font-semibold">
            {t.t("learn.recent")}
          </h2>
          <ul className="flex flex-col gap-2">
            {recent.map((a) => (
              <li key={a.id}>
                <ArticleLink article={a} progress={progressOf(a.id)} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {status !== "loading" && !hits && (
        <Card className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Bookmark aria-hidden="true" size={18} /> {t.t("learn.bookmarks")}
          </h2>
          {bookmarks.length === 0 ? (
            <p className="text-muted">{t.t("learn.bookmarksEmpty")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {bookmarks.map((a) => (
                <li key={a.id}>
                  <ArticleLink article={a} progress={progressOf(a.id)} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
