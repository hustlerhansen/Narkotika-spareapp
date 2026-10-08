import { t } from "@/lib/i18n";

/** Original NY START mark: a rising path toward a sun – "a new start". */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="14" fill="#101827" />
      <circle cx="31" cy="17" r="6" fill="#F5B841" />
      <path d="M9 37c6-1 9-5 12-10s6-8 18-9" fill="none" stroke="#14B8A6" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-base font-extrabold tracking-wide text-text">{t.t("app.name")}</span>
        <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted">{t.t("app.subtitle")}</span>
      </span>
    </span>
  );
}
