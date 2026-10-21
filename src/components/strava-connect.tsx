"use client";

import { useActionState } from "react";
import { disconnectStravaAction, syncStravaAction } from "@/app/actions";
import { fill } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/types";
import { memberStamp } from "@/lib/stamp";

type State = { error?: string };

export function StravaConnect({
  locale,
  t,
  configured,
  connectHref,
  status,
}: {
  locale: string;
  t: Dictionary;
  configured: boolean;
  connectHref: string;
  status: { athleteName: string; syncedAt: string } | null;
}) {
  const [syncState, syncAction, syncPending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await syncStravaAction(formData);
      return result ?? {};
    },
    {},
  );
  const [offState, offAction, offPending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await disconnectStravaAction(formData);
      return result ?? {};
    },
    {},
  );

  const busy = syncPending || offPending;
  const error = syncState.error || offState.error;

  return (
    <section className="mt-12">
      <h2 className="display text-4xl">{t.intranet.stravaTitle}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-mist">{t.intranet.stravaLead}</p>
      {!configured ? (
        <p className="mt-4 text-sm text-mist">{t.intranet.stravaMissingConfig}</p>
      ) : status ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-bone">
            {fill(t.intranet.stravaConnected, { name: status.athleteName || "Strava" })}
            {status.syncedAt ? ` · ${t.intranet.stravaSynced} ${memberStamp(status.syncedAt)}` : ""}
          </p>
          <div className="flex flex-wrap gap-3">
            <form action={syncAction}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                disabled={busy}
                className="bg-sodium px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-bone disabled:cursor-not-allowed disabled:opacity-50"
              >
                {syncPending ? t.intranet.stravaSyncing : t.intranet.stravaSync}
              </button>
            </form>
            <form
              action={offAction}
              onSubmit={(event) => {
                if (busy) {
                  event.preventDefault();
                  return;
                }
                if (!window.confirm(t.intranet.stravaDisconnectConfirm)) event.preventDefault();
              }}
            >
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                disabled={busy}
                className="border border-line px-4 py-2 text-xs uppercase tracking-[0.16em] text-mist disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.intranet.stravaDisconnect}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={connectHref}
            className="inline-block bg-sodium px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-bone"
          >
            {t.intranet.stravaConnect}
          </a>
          <a
            href={connectHref}
            className="inline-block border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-bone"
          >
            {t.intranet.stravaConnectGoogle}
          </a>
        </div>
      )}
      {error ? <p className="mt-4 text-sm text-sodium">{error}</p> : null}
    </section>
  );
}
