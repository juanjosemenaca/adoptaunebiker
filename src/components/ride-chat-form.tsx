"use client";

import { useActionState } from "react";
import { sendRideMessageAction } from "@/app/ride-actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string; ok?: boolean };

export function RideChatForm({
  rideId,
  locale,
  t,
  label,
  placeholder,
}: {
  rideId: string;
  locale: string;
  t: Dictionary;
  label?: string;
  placeholder?: string;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await sendRideMessageAction(formData);
      return result ?? {};
    },
    {},
  );

  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="rideId" value={rideId} />
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {label ?? t.intranet.groupRides.chatTitle}
        <textarea
          name="body"
          rows={3}
          required
          maxLength={2000}
          placeholder={placeholder ?? t.intranet.groupRides.chatPlaceholder}
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-sodium px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.intranet.groupRides.sending : t.intranet.groupRides.send}
      </button>
    </form>
  );
}
