"use client";

import { useActionState } from "react";
import { requestRideSpotAction } from "@/app/ride-actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string; ok?: boolean };

export function RideJoinForm({
  rideId,
  locale,
  t,
}: {
  rideId: string;
  locale: string;
  t: Dictionary;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> =>
      requestRideSpotAction(formData),
    {},
  );

  if (state.ok) {
    return <p className="mt-4 text-sm text-volt">{t.intranet.groupRides.requestSent}</p>;
  }

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="rideId" value={rideId} />
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.groupRides.requestSpot}
        <textarea
          name="message"
          rows={4}
          maxLength={280}
          placeholder={t.intranet.groupRides.requestHint}
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-sodium px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.intranet.groupRides.sending : t.intranet.groupRides.requestSpot}
      </button>
    </form>
  );
}
