"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { joinCommunity } from "@/app/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { Dictionary } from "@/i18n/types";
import { COUNTRIES, OTHER_PLACE, countryById, countryLabel } from "@/lib/places";
import { disciplines, practices } from "@/lib/labels";
import { hrefs } from "@/lib/paths";

type State = { error?: string; ok?: boolean };

type Draft = {
  name: string;
  lastName: string;
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
    lastName: "",
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
    lastName: String(data.get("lastName") ?? ""),
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
    [other]:
      selected || value === "ebike"
        ? current[other]
        : current[other].filter((item) => item !== value),
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
  t: Pick<Dictionary, "forms" | "disciplines">;
}) {
  const [draft, setDraft] = useState(emptyDraft);
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);
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
      if (!completedRef.current) {
        completedRef.current = true;
        trackEvent(analyticsEvents.registrationComplete);
      }
      return;
    }
    setDraft(readDraft());
  }, [state.ok]);

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackEvent(analyticsEvents.registrationStart);
  }

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
  if (state.ok) {
    return (
      <div role="status" className="public-join public-join-wide text-base leading-7 text-bone">
        <p className="public-join-wide">{t.forms.requestOk}</p>
        <p className="public-join-wide mt-3 text-mist">{t.forms.requestOkNext}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocus={markStarted}
      className="public-join"
      aria-describedby={state.error ? "join-form-error" : undefined}
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="public-join-group">
      <label>
        <span>{t.forms.name}</span>
        <input
          name="name"
          required
          minLength={2}
          autoComplete="given-name"
          value={draft.name}
          onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
        />
      </label>
      <label>
        <span>{t.forms.lastName}</span>
        <input
          name="lastName"
          autoComplete="family-name"
          value={draft.lastName}
          onChange={(event) =>
            setDraft((current) => ({ ...current, lastName: event.target.value }))
          }
        />
      </label>
      <label className="public-join-wide">
        <span>{t.forms.email}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          value={draft.email}
          onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
        />
      </label>
      </div>
      <div className="public-join-group">
      <p className="public-join-note">{t.forms.whyPlace}</p>
      <label>
        <span>{t.forms.country}</span>
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
        <label>
          <span>{t.forms.countryOther}</span>
          <input
            name="countryOther"
            required
            minLength={2}
            value={draft.countryOther}
            onChange={(event) =>
              setDraft((current) => ({ ...current, countryOther: event.target.value }))
            }
          />
        </label>
      ) : null}
      {countryIsOther ? (
        <label>
          <span>{t.forms.city}</span>
          <input
            name="cityOther"
            required
            minLength={2}
            autoComplete="address-level2"
            value={draft.cityOther}
            onChange={(event) =>
              setDraft((current) => ({ ...current, cityOther: event.target.value }))
            }
          />
        </label>
      ) : (
        <label>
          <span>{t.forms.city}</span>
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
        <label className="public-join-wide">
          <span>{t.forms.cityOther}</span>
          <input
            name="cityOther"
            required
            minLength={2}
            autoComplete="address-level2"
            value={draft.cityOther}
            onChange={(event) =>
              setDraft((current) => ({ ...current, cityOther: event.target.value }))
            }
          />
        </label>
      ) : null}
      </div>
      <div className="public-join-group">
      <p className="public-join-note">{t.forms.whyRole}</p>
      <fieldset className="public-join-wide">
        <legend>
          {t.forms.mentor}
        </legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {practices.map((value) => (
            <label key={`veteran-${value}`} className="inline-flex min-h-12 items-center gap-2 text-base text-bone">
              <input
                type="checkbox"
                name="veteran"
                value={value}
                checked={draft.veteran.includes(value)}
                onChange={() => setDraft((current) => toggleLevel(current, "veteran", value))}
              />
              {value === "ebike" ? t.forms.ebike : t.disciplines[value]}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="public-join-wide">
        <legend>
          {t.forms.beginner}
        </legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {practices.map((value) => (
            <label key={`beginner-${value}`} className="inline-flex min-h-12 items-center gap-2 text-base text-bone">
              <input
                type="checkbox"
                name="beginner"
                value={value}
                checked={draft.beginner.includes(value)}
                onChange={() => setDraft((current) => toggleLevel(current, "beginner", value))}
              />
              {value === "ebike" ? t.forms.ebike : t.disciplines[value]}
            </label>
          ))}
        </div>
      </fieldset>
      </div>
      <div className="public-join-group">
      <p className="public-join-note">{t.forms.whyInterested}</p>
      <fieldset className="public-join-wide">
        <legend>
          {t.forms.interestedIn}
        </legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {disciplines.map((value) => (
            <label key={value} className="inline-flex min-h-12 items-center gap-2 text-base text-bone">
              <input
                type="checkbox"
                name="interested"
                value={value}
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
      </div>
      <div className="public-join-group">
      <label className="public-join-wide">
        <span>{t.forms.bike}</span>
        <input
          name="bike"
          placeholder={t.forms.bikeHint}
          value={draft.bike}
          onChange={(event) => setDraft((current) => ({ ...current, bike: event.target.value }))}
        />
      </label>
      <label className="public-join-wide">
        <span>{t.forms.ride}</span>
        <textarea
          name="bio"
          rows={3}
          placeholder={t.forms.rideHint}
          value={draft.bio}
          onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
        />
      </label>
      <label className="public-join-wide">
        <span>{t.forms.looking}</span>
        <input
          name="lookingFor"
          placeholder={t.forms.lookingHint}
          value={draft.lookingFor}
          onChange={(event) =>
            setDraft((current) => ({ ...current, lookingFor: event.target.value }))
          }
        />
      </label>
      </div>
      {state.error ? (
        <p id="join-form-error" role="alert" className="public-join-wide text-sm text-sodium">
          {state.error}
        </p>
      ) : null}
      <details className="public-join-legal group">
        <summary className="cursor-pointer list-none marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-accent)]">
          <span className="flex items-center justify-between gap-3">
            <span>{t.forms.privacyFold}</span>
            <span className="text-lg leading-none text-mist transition group-open:rotate-45">+</span>
          </span>
        </summary>
        <div className="mt-4 space-y-2 text-sm leading-6 text-mist">
          <p>{t.forms.dataUse}</p>
          <p>{t.forms.privacyPurpose}</p>
          <p>{t.forms.privacyBasis}</p>
          <p>{t.forms.privacyRights}</p>
          <p>
            <Link
              href={hrefs(locale).privacidad}
              className="underline underline-offset-4 hover:text-bone"
            >
              {t.forms.privacyPolicyLink}
            </Link>
          </p>
        </div>
      </details>
      <div className="public-join-actions">
        <button
          type="submit"
          disabled={pending}
          className="public-cta w-full min-h-12 disabled:opacity-60"
        >
          {pending ? t.forms.creating : t.forms.create}
        </button>
      </div>
    </form>
  );
}
