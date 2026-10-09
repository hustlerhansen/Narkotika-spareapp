"use client";

import { useEffect, useState } from "react";
import { allArticles } from "@nystart/core";
import { ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { isSupabaseConfigured } from "@/lib/config";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useAuthUser } from "@/lib/use-auth";
import { useT } from "@/lib/i18n";

interface Overview {
  suppressionThreshold: number;
  accounts: Record<"registered" | "confirmed" | "newLast7Days" | "activeLast7Days" | "activeLast30Days", number | null>;
  errorsLast14Days: { day: string; code: string; area: string; release: string; count: number }[];
  flags: Record<string, unknown>;
}

type LoadState = { kind: "idle" } | { kind: "noAccess" } | { kind: "failed" } | { kind: "ready"; roles: string[]; overview: Overview };

/** Aggregate-only admin overview. All protection is enforced in the database (admin_overview, RLS). */
export function AdminOverview() {
  const t = useT();
  const { user, loading } = useAuthUser();
  const [state, setState] = useState<LoadState>({ kind: "idle" });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const supabase = await getBrowserSupabase();
      if (!supabase) return;
      const roles = await supabase.rpc("my_admin_roles");
      const list = (roles.data as string[] | null) ?? [];
      if (cancelled) return;
      if (roles.error || list.length === 0) return setState({ kind: "noAccess" });
      const { data, error } = await supabase.rpc("admin_overview");
      if (cancelled) return;
      if (error) return setState({ kind: error.code === "42501" ? "noAccess" : "failed" });
      setState({ kind: "ready", roles: list, overview: data as Overview });
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("admin.title")} intro={t.t("admin.intro")} />
      {!isSupabaseConfigured ? (
        <Notice title={t.t("admin.title")} tone="info">
          {t.t("admin.notConfigured")}
        </Notice>
      ) : loading ? (
        <p role="status">{t.t("common.loading")}</p>
      ) : !user ? (
        <Card className="flex flex-col gap-3">
          <p>{t.t("admin.signInRequired")}</p>
          <ButtonLink href="/logg-inn" variant="secondary">
            {t.t("account.submitSignIn")}
          </ButtonLink>
        </Card>
      ) : state.kind === "noAccess" ? (
        <p role="alert" className="font-medium text-danger">
          {t.t("admin.noAccess")}
        </p>
      ) : state.kind === "failed" ? (
        <p role="alert" className="font-medium text-danger">
          {t.t("admin.loadFailed")}
        </p>
      ) : state.kind === "ready" ? (
        <Dashboard roles={state.roles} overview={state.overview} />
      ) : (
        <p role="status">{t.t("common.loading")}</p>
      )}
    </div>
  );
}

function Dashboard({ roles, overview }: { roles: string[]; overview: Overview }) {
  const t = useT();
  const articles = allArticles();
  const count = (n: number | null) => (n === null ? t.t("admin.suppressed") : t.formatNumber(n));
  const accountRows = (["registered", "confirmed", "newLast7Days", "activeLast7Days", "activeLast30Days"] as const).map((k) => [t.t(`admin.${k}`), count(overview.accounts[k])]);
  const contentRows = [
    [t.t("admin.contentArticles"), articles.length],
    [t.t("admin.contentAwaiting"), articles.filter((a) => a.review.status === "awaiting_clinical_review").length],
    [t.t("admin.contentApproved"), articles.filter((a) => a.review.status === "approved").length],
    [t.t("admin.contentSafetyCritical"), articles.filter((a) => a.safetyCritical).length],
  ] as const;

  return (
    <>
      <p className="text-sm text-muted">{t.t("admin.roles", { roles: roles.join(", ") })}</p>
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t.t("admin.accountsTitle")}</h2>
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2">
          {accountRows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt>{label}</dt>
              <dd className="text-right font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted">{t.t("admin.suppressionNote", { k: overview.suppressionThreshold })}</p>
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t.t("admin.errorsTitle")}</h2>
        {overview.errorsLast14Days.length === 0 ? (
          <p>{t.t("admin.errorsNone")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th scope="col" className="py-1 pr-3">{t.t("admin.colDay")}</th>
                  <th scope="col" className="py-1 pr-3">{t.t("admin.colCode")}</th>
                  <th scope="col" className="py-1 pr-3">{t.t("admin.colArea")}</th>
                  <th scope="col" className="py-1 text-right">{t.t("admin.colCount")}</th>
                </tr>
              </thead>
              <tbody>
                {overview.errorsLast14Days.map((e) => (
                  <tr key={`${e.day}-${e.code}-${e.area}-${e.release}`} className="border-t border-border">
                    <td className="py-1 pr-3">{e.day}</td>
                    <td className="py-1 pr-3 font-mono">{e.code}</td>
                    <td className="py-1 pr-3">{e.area}</td>
                    <td className="py-1 text-right tabular-nums">{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-sm text-muted">{t.t("admin.errorsNote")}</p>
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t.t("admin.contentTitle")}</h2>
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2">
          {contentRows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt>{label}</dt>
              <dd className="text-right font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted">{t.t("admin.contentNote")}</p>
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t.t("admin.flagsTitle")}</h2>
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2">
          {Object.entries(overview.flags).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="font-mono text-sm">{key}</dt>
              <dd className="text-right font-semibold">{JSON.stringify(value)}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t.t("admin.usageTitle")}</h2>
        <p>{t.t("admin.usageBody")}</p>
      </Card>
    </>
  );
}
