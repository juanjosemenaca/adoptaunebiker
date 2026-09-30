"use client";

import { useActionState } from "react";
import { requestAdoption } from "@/app/actions";
import { fill } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string; ok?: boolean };

export function AdoptForm({
  toId,
  toName,
  locale,
  t,
}: {
  toId: string;
  toName: string;
  locale: string;
  t: Dictionary;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> =>
      requestAdoption(formData),
    {},
  );

  if (state.ok) {
    return (
      <p className="mt-4 text-sm text-volt">
        {fill(t.forms.sent, { name: toName.split(" ")[0] })}
      </p>
    );
  }

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="toId" value={toId} />
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.note}
        <textarea
          name="message"
          rows={4}
          maxLength={280}
          placeholder={t.forms.noteHint}
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-sodium px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.forms.sending : t.forms.ask}
      </button>
    </form>
  );
}
