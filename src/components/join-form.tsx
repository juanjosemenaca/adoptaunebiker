"use client";

import { useActionState } from "react";
import { joinCommunity } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string; ok?: boolean };

export function JoinForm({
  locale,
  t,
}: {
  locale: string;
  t: Dictionary;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await joinCommunity(formData);
      return result ?? {};
    },
    {},
  );

  if (state.ok) {
    return (
      <p className="max-w-xl border border-volt bg-rubber p-5 text-sm leading-7 text-bone">
        {t.forms.requestOk}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4 border border-line bg-rubber p-5">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.name}
        <input
          name="name"
          required
          minLength={2}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.city}
        <input
          name="city"
          required
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.role}
        </legend>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input type="radio" name="role" value="mentor" required />
          {t.forms.mentor}
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input type="radio" name="role" value="ebiker" />
          {t.forms.beginner}
        </label>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.discipline}
        </legend>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input type="radio" name="discipline" value="mtb" required />
          {t.disciplines.mtb}
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input type="radio" name="discipline" value="carretera" />
          {t.disciplines.carretera}
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input type="radio" name="discipline" value="gravel" />
          {t.disciplines.gravel}
        </label>
      </fieldset>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.bike}
        <input
          name="bike"
          placeholder={t.forms.bikeHint}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.ride}
        <textarea
          name="bio"
          rows={3}
          placeholder={t.forms.rideHint}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.looking}
        <input
          name="lookingFor"
          placeholder={t.forms.lookingHint}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full bg-sodium px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.forms.creating : t.forms.create}
      </button>
    </form>
  );
}
