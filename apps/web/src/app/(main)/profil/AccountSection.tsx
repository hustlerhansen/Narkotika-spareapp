"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isSupabaseConfigured } from "@/lib/config";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useAuthUser } from "@/lib/use-auth";
import { useT } from "@/lib/i18n";

export function AccountSection() {
  const t = useT();
  const { user, loading } = useAuthUser();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{t.t("profile.account")}</h2>
      {!isSupabaseConfigured ? (
        <p className="text-muted">{t.t("profile.accountNotConfigured")}</p>
      ) : loading ? (
        <p className="text-muted">{t.t("common.loading")}</p>
      ) : user ? (
        <>
          <p>{t.t("profile.signedInAs", { email: user.email ?? "" })}</p>
          <p className="text-sm text-muted">{t.t("profile.syncNotActive")}</p>
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
                <Button
                  variant="danger"
                  onClick={async () => {
                    const supabase = getBrowserSupabase();
                    if (!supabase) return;
                    const { error: rpcError } = await supabase.rpc("delete_my_account");
                    if (rpcError) {
                      setError(t.t("errors.generic"));
                      return;
                    }
                    await supabase.auth.signOut();
                    setConfirmDelete(false);
                  }}
                >
                  {t.t("profile.deleteAccount")}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" className="self-start text-danger" onClick={() => setConfirmDelete(true)}>
              {t.t("profile.deleteAccount")}
            </Button>
          )}
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
        </>
      ) : (
        <ButtonLink href="/logg-inn" variant="secondary">
          {t.t("profile.signIn")}
        </ButtonLink>
      )}
    </Card>
  );
}
