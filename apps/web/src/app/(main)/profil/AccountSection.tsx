"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isSupabaseConfigured } from "@/lib/config";
import { downloadFile, todayStamp } from "@/lib/download";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useAuthUser } from "@/lib/use-auth";
import { useT } from "@/lib/i18n";

export function AccountSection({ confirmed = false }: { confirmed?: boolean }) {
  const t = useT();
  const { user, loading } = useAuthUser();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function exportAccountData() {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    setError(null);
    setBusy(true);
    const { data, error: rpcError } = await supabase.rpc("export_my_data");
    setBusy(false);
    if (rpcError) return setError(t.t("account.exportFailed"));
    downloadFile(`ny-start-konto-${todayStamp()}.json`, JSON.stringify(data, null, 2));
  }

  async function deleteAccount() {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    setBusy(true);
    const { error: rpcError } = await supabase.rpc("delete_my_account");
    setBusy(false);
    if (rpcError) return setError(t.t("errors.generic"));
    // The user no longer exists on the server; clear the local session only.
    await supabase.auth.signOut({ scope: "local" });
    setConfirmDelete(false);
    setDeleted(true);
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{t.t("profile.account")}</h2>
      {deleted && (
        <p role="status" className="font-medium text-success">
          {t.t("account.deleted")}
        </p>
      )}
      {!isSupabaseConfigured ? (
        <p className="text-muted">{t.t("profile.accountNotConfigured")}</p>
      ) : loading ? (
        <p className="text-muted">{t.t("common.loading")}</p>
      ) : user ? (
        <>
          {confirmed && (
            <p role="status" className="font-medium text-success">
              {t.t("account.confirmed")}
            </p>
          )}
          <p>{t.t("profile.signedInAs", { email: user.email ?? "" })}</p>
          <p className="text-sm text-muted">{t.t("account.noSync")}</p>
          <Button variant="secondary" onClick={exportAccountData} disabled={busy}>
            {t.t("account.exportCloud")}
          </Button>
          <p className="text-sm text-muted">{t.t("account.exportCloudHint")}</p>
          <ButtonLink href="/nytt-passord" variant="secondary">
            {t.t("account.changePassword")}
          </ButtonLink>
          <Button variant="secondary" onClick={() => getBrowserSupabase()?.auth.signOut()}>
            {t.t("profile.signOut")}
          </Button>
          {confirmDelete ? (
            <div role="alertdialog" aria-labelledby="delete-account-q" className="rounded-xl border border-danger bg-danger-soft p-3">
              <p id="delete-account-q" className="font-medium">
                {t.t("profile.deleteAccountConfirm")}
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                  {t.t("common.cancel")}
                </Button>
                <Button variant="danger" onClick={deleteAccount} disabled={busy}>
                  {t.t("profile.deleteAccount")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Button variant="ghost" className="self-start text-danger" onClick={() => setConfirmDelete(true)}>
                {t.t("profile.deleteAccount")}
              </Button>
              <p className="text-sm text-muted">{t.t("account.deleteHint")}</p>
            </div>
          )}
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">{t.t("account.intro")}</p>
          <ButtonLink href="/logg-inn" variant="secondary">
            {t.t("profile.signIn")}
          </ButtonLink>
          <ButtonLink href="/registrer" variant="ghost">
            {t.t("account.signUpTitle")}
          </ButtonLink>
        </div>
      )}
    </Card>
  );
}

function AccountSectionWithParams() {
  return <AccountSection confirmed={useSearchParams().get("konto") === "bekreftet"} />;
}

/** Account card; shows a confirmation after the e-mail link (`?konto=bekreftet`). */
export function AccountCard() {
  return (
    <Suspense fallback={<AccountSection />}>
      <AccountSectionWithParams />
    </Suspense>
  );
}
