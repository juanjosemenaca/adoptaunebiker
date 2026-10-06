"use client";

import { startTransition, useActionState, useEffect, useState, type FormEvent } from "react";
import { joinCommunity } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";
import { COUNTRIES, OTHER_PLACE, countryById, countryLabel } from "@/lib/places";
import { disciplines, practices } from "@/lib/labels";

type State = { error?: string; ok?: boolean };

type Draft = {
  name: string;
  email: string;
  country: string;
  countryOther: string;
  city: string;
  cityOther: string;
  veteran: string[];
  beginner: string[];
  interested: string[];
  bike: string;
  bio: string;
  lookingFor: string;
};

const DRAFT_KEY = "adopta.join-form";

function emptyDraft(): Draft {
  return {
    name: "",
    email: "",
    country: "",
    countryOther: "",
    city: "",
    cityOther: "",
    veteran: [],
    beginner: [],
    interested: [],
    bike: "",
    bio: "",
    lookingFor: "",
  };
}

function readDraft(): Draft {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      ...emptyDraft(),
      ...parsed,
      veteran: Array.isArray(parsed.veteran) ? parsed.veteran : [],
      beginner: Array.isArray(parsed.beginner) ? parsed.beginner : [],
      interested: Array.isArray(parsed.interested) ? parsed.interested : [],
    };
  } catch {
    return emptyDraft();
  }
}

function draftFromForm(data: FormData): Draft {
  return {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    country: String(data.get("country") ?? ""),
    countryOther: String(data.get("countryOther") ?? ""),
    city: String(data.get("city") ?? ""),
    cityOther: String(data.get("cityOther") ?? ""),
    veteran: data.getAll("veteran").map((item) => String(item)),
    beginner: data.getAll("beginner").map((item) => String(item)),
    interested: data.getAll("interested").map((item) => String(item)),
    bike: String(data.get("bike") ?? ""),
    bio: String(data.get("bio") ?? ""),
    lookingFor: String(data.get("lookingFor") ?? ""),
  };
}

function toggleLevel(current: Draft, field: "veteran" | "beginner", value: string): Draft {
  const other = field === "veteran" ? "beginner" : "veteran";
  const selected = current[field].includes(value);
  return {
    ...current,
    [field]: selected
      ? current[field].filter((item) => item !== value)
      : [...current[field], value],
    [other]: selected ? current[other] : current[other].filter((item) => item !== value),
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

  const country = countryById(draft.country);
  const countryIsOther = draft.country === OTHER_PLACE;
  const cityIsOther = countryIsOther || draft.city === OTHER_PLACE;
  const cities = country?.cities ?? [];
  const fieldClass =
    "mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";
  const sectionLegendClass =
    "pb-1 text-base font-semibold uppercase tracking-[0.12em] text-sodium";

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
        {t.forms.country}
        <select
          name="country"
          required
          autoComplete="country-name"
          value={draft.country}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              country: event.target.value,
              countryOther: event.target.value === OTHER_PLACE ? current.countryOther : "",
              city: "",
              cityOther: "",
            }))
          }
          className={fieldClass}
        >
          <option value="">{t.forms.chooseCountry}</option>
          {COUNTRIES.map((item) => (
            <option key={item.id} value={item.id}>
              {countryLabel(item.id, locale)}
            </option>
          ))}
          <option value={OTHER_PLACE}>{t.forms.other}</option>
        </select>
      </label>
      {countryIsOther ? (
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.countryOther}
          <input
            name="countryOther"
            required
            minLength={2}
            value={draft.countryOther}
            onChange={(event) =>
              setDraft((current) => ({ ...current, countryOther: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
      ) : null}
      {countryIsOther ? (
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.city}
          <input
            name="cityOther"
            required
            minLength={2}
            autoComplete="address-level2"
            value={draft.cityOther}
            onChange={(event) =>
              setDraft((current) => ({ ...current, cityOther: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
      ) : (
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.city}
          <select
            name="city"
            required
            disabled={!draft.country}
            autoComplete="address-level2"
            value={draft.city}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                city: event.target.value,
                cityOther: event.target.value === OTHER_PLACE ? current.cityOther : "",
              }))
            }
            className={fieldClass}
          >
            <option value="">{t.forms.chooseCity}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
            {draft.country ? <option value={OTHER_PLACE}>{t.forms.other}</option> : null}
          </select>
        </label>
      )}
      {cityIsOther && !countryIsOther ? (
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.forms.cityOther}
          <input
            name="cityOther"
            required
            minLength={2}
            autoComplete="address-level2"
            value={draft.cityOther}
            onChange={(event) =>
              setDraft((current) => ({ ...current, cityOther: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
      ) : null}
      <fieldset className="pt-3">
        <legend className={sectionLegendClass}>
          {t.forms.mentor}
        </legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {practices.map((value) => (
            <label key={`veteran-${value}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                name="veteran"
                value={value}
                className="accent-sodium"
                checked={draft.veteran.includes(value)}
                onChange={() => setDraft((current) => toggleLevel(current, "veteran", value))}
              />
              {value === "ebike" ? t.forms.ebike : t.disciplines[value]}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="pt-3">
        <legend className={sectionLegendClass}>
          {t.forms.beginner}
        </legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {practices.map((value) => (
            <label key={`beginner-${value}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                name="beginner"
                value={value}
                className="accent-sodium"
                checked={draft.beginner.includes(value)}
                onChange={() => setDraft((current) => toggleLevel(current, "beginner", value))}
              />
              {value === "ebike" ? t.forms.ebike : t.disciplines[value]}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="pt-3">
        <legend className={sectionLegendClass}>
          {t.forms.interestedIn}
        </legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {disciplines.map((value) => (
            <label key={value} className="inline-flex min-h-11 items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                name="interested"
                value={value}
                className="accent-sodium"
                checked={draft.interested.includes(value)}
                onChange={() =>
                  setDraft((current) => ({
                    ...current,
                    interested: current.interested.includes(value)
                      ? current.interested.filter((item) => item !== value)
                      : [...current.interested, value],
                  }))
                }
              />
              {t.disciplines[value]}
            </label>
          ))}
        </div>
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
