"use client";

import { useEffect } from "react";
import { AArrowDown, AArrowUp, Bookmark, BookmarkCheck } from "lucide-react";
import { recordReading, toggleBookmark, updatePreferences, type Preferences } from "@nystart/core";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import { store, useStore } from "@/lib/store";

const SCALES: Preferences["textScale"][] = [1, 1.15, 1.3, 1.5];

/** Bookmark, text size and reading-progress tracking for an article. */
export function ArticleTools({ articleId }: { articleId: string }) {
  const t = useT();
  const { state, status } = useStore();
  const bookmarked = state.education.bookmarks.includes(articleId);
  const progress = state.education.reading.find((r) => r.articleId === articleId)?.progress ?? 0;
  const canStore = status === "ready" && state.profile !== null;

  useEffect(() => {
    if (!canStore) return;
    let last = 0;
    const measure = () => {
      const el = document.getElementById("article-body");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const seen = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height));
      const rounded = Math.round(seen * 20) / 20;
      if (rounded > last) {
        last = rounded;
        store.apply((s, ctx) => recordReading(s, articleId, rounded, ctx));
      }
    };
    measure();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [articleId, canStore]);

  const scaleIndex = SCALES.indexOf(state.preferences.textScale);
  const setScale = (i: number) => store.apply((s) => updatePreferences(s, { textScale: SCALES[Math.min(SCALES.length - 1, Math.max(0, i))]! }));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canStore && (
        <Button variant="secondary" aria-pressed={bookmarked} onClick={() => store.apply((s) => toggleBookmark(s, articleId))}>
          {bookmarked ? <BookmarkCheck aria-hidden="true" size={18} /> : <Bookmark aria-hidden="true" size={18} />}
          {bookmarked ? t.t("learn.unbookmark") : t.t("learn.bookmark")}
        </Button>
      )}
      <Button variant="ghost" aria-label={`${t.t("profile.textSize")} −`} disabled={scaleIndex <= 0} onClick={() => setScale(scaleIndex - 1)}>
        <AArrowDown aria-hidden="true" size={20} />
      </Button>
      <Button variant="ghost" aria-label={`${t.t("profile.textSize")} +`} disabled={scaleIndex >= SCALES.length - 1} onClick={() => setScale(scaleIndex + 1)}>
        <AArrowUp aria-hidden="true" size={20} />
      </Button>
      {canStore && progress > 0 && <span className="text-sm text-muted">{t.t("learn.progress", { percent: Math.round(progress * 100) })}</span>}
    </div>
  );
}
