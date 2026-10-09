/**
 * Kunnskapssenter – content model.
 *
 * Content is bundled with the app (works offline, version-controlled review).
 * REVIEW RULES
 * - Only `approved` content may be described as clinically reviewed.
 * - `review.reviewer` and `review.lastReviewedOn` are null until a real,
 *   documented clinical review has happened. Never fabricate them.
 */
import type { SubstanceId } from "../model";

export const EDUCATION_CATEGORY_IDS = [
  "forsta-avhengighet",
  "crack-og-kokain",
  "andre-rusmidler",
  "russug-og-triggere",
  "tilbakefall-og-ny-start",
  "psykisk-helse",
  "behandling-og-hjelp",
] as const;
export type EducationCategoryId = (typeof EDUCATION_CATEGORY_IDS)[number];

export const REVIEW_STATUSES = ["draft", "awaiting_clinical_review", "approved", "needs_update"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export interface ArticleReview {
  status: ReviewStatus;
  /** ISO date of the last completed clinical review. Null until it has happened. */
  lastReviewedOn: string | null;
  /** Role/organisation of the reviewer. Null until a real review is documented. */
  reviewer: string | null;
}

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Article {
  /** URL slug, kebab-case, unique. */
  id: string;
  categoryId: EducationCategoryId;
  title: string;
  /** 1–3 sentences shown under the title and in lists. */
  intro: string;
  sections: ArticleSection[];
  /** 2–5 short take-aways. */
  keyTakeaways: string[];
  /** Practical suggestions, when relevant. */
  copingTips?: string[];
  /** Prominent safety callout (e.g. when to call 113). */
  safetyNote?: string;
  /** 2–4 ids of other articles. */
  relatedIds: string[];
  /** Ids from SUPPORT_RESOURCES. */
  helpResourceIds: string[];
  /** Ids from EDUCATION_SOURCES. */
  sourceIds: string[];
  substances?: SubstanceId[];
  /** Contains medical or safety statements. */
  safetyCritical: boolean;
  review: ArticleReview;
  /** Date the text was last edited (not a review date). */
  updatedOn: string;
  /** Cached for offline reading on first visit. */
  essential?: boolean;
}

export interface EducationCategory {
  id: EducationCategoryId;
  title: string;
  description: string;
}
