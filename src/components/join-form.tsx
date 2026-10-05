"use client";

import { startTransition, useActionState, useEffect, useState, type FormEvent } from "react";
import { joinCommunity } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string; ok?: boolean };

type Draft = {
  name: string;
  email: string;
  city: string;
  role: string;
  discipline: string;
  bike: string;
  bio: string;
  lookingFor: string;
};

const DRAFT_KEY = "adopta.join-form";

function emptyDraft(): Draft {
  return {
    name: "",
    email: "",
    city: "",
    role: "",
    discipline: "",
    bike: "",
    bio: "",
    lookingFor: "",
  };
}

function readDraft(): Draft {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft();
    return { ...emptyDraft(), ...(JSON.parse(raw) as Partial<Draft>) };
  } catch {
    return emptyDraft();
  }
}

function draftFromForm(data: FormData): Draft {
  return {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    city: String(data.get("city") ?? ""),
    role: String(data.get("role") ?? ""),
    discipline: String(data.get("discipline") ?? ""),
    bike: String(data.get("bike") ?? ""),
    bio: String(data.get("bio") ?? ""),
    lookingFor: String(data.get("lookingFor") ?? ""),
  };
}

function keepOnForm() {
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}#crear-plaza`);
  document.getElementById("crear-plaza")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function JoinForm({
  locale,
  t,
}: {
  locale: string;
  t: Dictionary;
}) {
  const [draft, setDraft] = useState(emptyDraft);
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await joinCommunity(formData);
      return result ?? {};
    },
    {},
  );

  useEffect(() => {
    if (state.ok) {
      sessionStorage.removeItem(DRAFT_KEY);
      return;
    }
    setDraft(readDraft());
  }, [state.ok]);

  useEffect(() => {
    if (!state.ok && !state.error) return;
    keepOnForm();
    const id = window.setTimeout(keepOnForm, 80);
    return () => window.clearTimeout(id);
  }, [state.ok, state.error]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = draftFromForm(data);
    setDraft(next);
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    startTransition(() => {
      action(data);
    });
  }

  if (state.ok) {
    return (
      <p
        role="status"
        className="max-w-xl border border-volt bg-rubber p-5 text-sm leading-7 text-bone"
      >
        {t.forms.requestOk}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-line bg-rubber p-5">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.name}
        <input
          name="name"
          required
          minLength={2}
          autoComplete="nickname"
          value={draft.name}
          onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
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
          value={draft.email}
          onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.city}
        <input
          name="city"
          required
          autoComplete="address-level2"
          value={draft.city}
          onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.role}
        </legend>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input
            type="radio"
            name="role"
            value="mentor"
            required
            className="accent-sodium"
            checked={draft.role === "mentor"}
            onChange={() => setDraft((current) => ({ ...current, role: "mentor" }))}
          />
          {t.forms.mentor}
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input
            type="radio"
            name="role"
            value="ebiker"
            className="accent-sodium"
            checked={draft.role === "ebiker"}
            onChange={() => setDraft((current) => ({ ...current, role: "ebiker" }))}
          />
          {t.forms.beginner}
        </label>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.discipline}
        </legend>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input
            type="radio"
            name="discipline"
            value="mtb"
            required
            className="accent-sodium"
            checked={draft.discipline === "mtb"}
            onChange={() => setDraft((current) => ({ ...current, discipline: "mtb" }))}
          />
          {t.disciplines.mtb}
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input
            type="radio"
            name="discipline"
            value="carretera"
            className="accent-sodium"
            checked={draft.discipline === "carretera"}
            onChange={() => setDraft((current) => ({ ...current, discipline: "carretera" }))}
          />
          {t.disciplines.carretera}
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-bone">
          <input
            type="radio"
            name="discipline"
            value="gravel"
            className="accent-sodium"
            checked={draft.discipline === "gravel"}
            onChange={() => setDraft((current) => ({ ...current, discipline: "gravel" }))}
          />
          {t.disciplines.gravel}
        </label>
      </fieldset>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.bike}
        <input
          name="bike"
          placeholder={t.forms.bikeHint}
          value={draft.bike}
          onChange={(event) => setDraft((current) => ({ ...current, bike: event.target.value }))}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.ride}
        <textarea
          name="bio"
          rows={3}
          placeholder={t.forms.rideHint}
          value={draft.bio}
          onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.looking}
        <input
          name="lookingFor"
          placeholder={t.forms.lookingHint}
          value={draft.lookingFor}
          onChange={(event) =>
            setDraft((current) => ({ ...current, lookingFor: event.target.value }))
          }
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
