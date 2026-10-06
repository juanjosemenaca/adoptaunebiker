"use client";

import { useActionState, useState } from "react";
import { updateMemberAction } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";
import { disciplines, practices } from "@/lib/labels";
import type { Discipline, Practice } from "@/lib/types";

type MemberFields = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  veteranIn: Practice[];
  beginnerIn: Practice[];
  interestedIn: Discipline[];
  bike: string;
  bio: string;
  lookingFor: string;
};

type State = { error?: string };

function toggleLevel(
  veteran: Practice[],
  beginner: Practice[],
  field: "veteran" | "beginner",
  value: Practice,
) {
  const current = field === "veteran" ? veteran : beginner;
  const other = field === "veteran" ? beginner : veteran;
  const selected = current.includes(value);
  const next = selected ? current.filter((item) => item !== value) : [...current, value];
  const rest = selected ? other : other.filter((item) => item !== value);
  return field === "veteran"
    ? { veteran: next, beginner: rest }
    : { veteran: rest, beginner: next };
}

export function MemberEditForm({
  member,
  locale,
  t,
}: {
  member: MemberFields;
  locale: string;
  t: Dictionary;
}) {
  const [veteran, setVeteran] = useState<Practice[]>(member.veteranIn);
  const [beginner, setBeginner] = useState<Practice[]>(member.beginnerIn);
  const [interested, setInterested] = useState<Discipline[]>(member.interestedIn);
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await updateMemberAction(formData);
      return result ?? {};
    },
    {},
  );

  const fieldClass =
    "mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";
  const legendClass = "pb-1 text-base font-semibold uppercase tracking-[0.12em] text-sodium";

  return (
    <form action={action} className="mt-10 space-y-4 border border-line bg-rubber p-5 sm:p-6">
      <input type="hidden" name="id" value={member.id} />
      <input type="hidden" name="locale" value={locale} />
      <p className="text-[10px] uppercase tracking-[0.18em] text-mist">{t.admin.memberDataTitle}</p>

      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.name}
        <input name="name" required minLength={2} defaultValue={member.name} className={fieldClass} />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.lastName}
        <input name="lastName" defaultValue={member.lastName} className={fieldClass} />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.email}
        <input value={member.email} readOnly className={`${fieldClass} text-mist`} />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.country}
        <input name="country" defaultValue={member.country} className={fieldClass} />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.city}
        <input name="city" required defaultValue={member.city} className={fieldClass} />
      </label>

      <fieldset className="pt-3">
        <legend className={legendClass}>{t.forms.veteranIn}</legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {practices.map((value) => (
            <label key={`veteran-${value}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                name="veteran"
                value={value}
                className="accent-sodium"
                checked={veteran.includes(value)}
                onChange={() => {
                  const next = toggleLevel(veteran, beginner, "veteran", value);
                  setVeteran(next.veteran);
                  setBeginner(next.beginner);
                }}
              />
              {value === "ebike" ? t.forms.ebike : t.disciplines[value]}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="pt-3">
        <legend className={legendClass}>{t.forms.beginnerIn}</legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {practices.map((value) => (
            <label key={`beginner-${value}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                name="beginner"
                value={value}
                className="accent-sodium"
                checked={beginner.includes(value)}
                onChange={() => {
                  const next = toggleLevel(veteran, beginner, "beginner", value);
                  setVeteran(next.veteran);
                  setBeginner(next.beginner);
                }}
              />
              {value === "ebike" ? t.forms.ebike : t.disciplines[value]}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="pt-3">
        <legend className={legendClass}>{t.forms.interestedIn}</legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {disciplines.map((value) => (
            <label key={value} className="inline-flex min-h-11 items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                name="interested"
                value={value}
                className="accent-sodium"
                checked={interested.includes(value)}
                onChange={() =>
                  setInterested((current) =>
                    current.includes(value)
                      ? current.filter((item) => item !== value)
                      : [...current, value],
                  )
                }
              />
              {t.disciplines[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.bike}
        <input name="bike" defaultValue={member.bike} placeholder={t.forms.bikeHint} className={fieldClass} />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.ride}
        <textarea
          name="bio"
          rows={3}
          defaultValue={member.bio}
          placeholder={t.forms.rideHint}
          className={fieldClass}
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.looking}
        <textarea
          name="lookingFor"
          rows={3}
          defaultValue={member.lookingFor}
          placeholder={t.forms.lookingHint}
          className={fieldClass}
        />
      </label>

      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 bg-sodium px-4 text-xs font-semibold uppercase tracking-[0.16em] text-bone disabled:opacity-50"
      >
        {pending ? t.admin.memberSaving : t.admin.memberSave}
      </button>
    </form>
  );
}
