"use client";

import { useActionState, useRef, useState } from "react";
import { saveGarageAction } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";
import {
  BIKE_NAME_MAX,
  BIKE_NOTE_MAX,
  MAX_MEMBER_BIKES,
  newMemberBike,
  type MemberBike,
  type MemberBikeKind,
} from "@/lib/bikes";

type State = { error?: string };

export function BikeGarageForm({
  memberId,
  locale,
  t,
  garage,
  next,
  canUpload = true,
}: {
  memberId: string;
  locale: string;
  t: Dictionary;
  garage: MemberBike[];
  next?: "cuenta";
  canUpload?: boolean;
}) {
  const [bikes, setBikes] = useState<MemberBike[]>(garage);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [cleared, setCleared] = useState<Record<string, boolean>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await saveGarageAction(formData);
      return result ?? {};
    },
    {},
  );

  const fieldClass = "mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";

  function patch(id: string, change: Partial<MemberBike>) {
    setBikes((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));
  }

  return (
    <section className="mt-10 border border-line bg-rubber p-5 sm:p-6">
      <h2 className="display text-4xl">{t.forms.bikes}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-mist">{t.forms.bikesHint}</p>

      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={memberId} />
        <input type="hidden" name="locale" value={locale} />
        {next ? <input type="hidden" name="next" value={next} /> : null}

        {bikes.length === 0 ? (
          <p className="text-sm leading-7 text-mist">{t.forms.bikesEmpty}</p>
        ) : null}

        {bikes.map((bike) => {
          const shown = previews[bike.id] || (!cleared[bike.id] && bike.photoUrl) || "";
          return (
            <article key={bike.id} className="border border-line bg-asphalt p-4">
              <input type="hidden" name="bikeId" value={bike.id} />
              <input type="hidden" name="bikePhotoPath" value={cleared[bike.id] ? "" : bike.photoPath} />
              <input type="hidden" name="bikePhotoUrl" value={cleared[bike.id] ? "" : bike.photoUrl} />
              {cleared[bike.id] ? <input type="hidden" name="clearPhoto" value={bike.id} /> : null}

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="sm:w-40">
                  {canUpload ? (
                    <input
                      ref={(node) => {
                        fileRefs.current[bike.id] = node;
                      }}
                      type="file"
                      name={`photo-${bike.id}`}
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setPreviews((current) => ({
                          ...current,
                          [bike.id]: file ? URL.createObjectURL(file) : "",
                        }));
                        if (file) setCleared((current) => ({ ...current, [bike.id]: false }));
                      }}
                    />
                  ) : null}
                  <button
                    type="button"
                    disabled={pending || !canUpload}
                    onClick={() => fileRefs.current[bike.id]?.click()}
                    aria-label={shown ? t.intranet.photoChange : t.forms.bikesPhoto}
                    className="relative block aspect-[4/3] w-full overflow-hidden border border-line bg-panel text-[10px] uppercase tracking-[0.16em] text-mist disabled:opacity-60 sm:h-28 sm:w-40"
                  >
                    {shown ? (
                      <img src={shown} alt="" className="h-full w-full object-cover" />
                    ) : (
                      t.forms.bikesPhoto
                    )}
                  </button>
                  {canUpload && shown ? (
                    <button
                      type="button"
                      disabled={pending}
                      className="mt-2 text-[11px] uppercase tracking-[0.14em] text-mist hover:text-bone disabled:opacity-50"
                      onClick={() => {
                        const input = fileRefs.current[bike.id];
                        if (input) input.value = "";
                        setPreviews((current) => ({ ...current, [bike.id]: "" }));
                        setCleared((current) => ({ ...current, [bike.id]: true }));
                        patch(bike.id, { photoPath: "", photoUrl: "" });
                      }}
                    >
                      {t.intranet.photoRemove}
                    </button>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
                    {t.forms.bike}
                    <input
                      name="bikeName"
                      value={bike.name}
                      maxLength={BIKE_NAME_MAX}
                      placeholder={t.forms.bikeHint}
                      onChange={(event) => patch(bike.id, { name: event.target.value })}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
                    {t.forms.bikesKind}
                    <select
                      name="bikeKind"
                      value={bike.kind}
                      onChange={(event) =>
                        patch(bike.id, { kind: event.target.value as MemberBikeKind })
                      }
                      className={fieldClass}
                    >
                      <option value="muscular">{t.bikeKinds.muscular}</option>
                      <option value="ebike">{t.bikeKinds.ebike}</option>
                    </select>
                  </label>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
                    {t.forms.bikesNote}
                    <input
                      name="bikeNote"
                      value={bike.note}
                      maxLength={BIKE_NOTE_MAX}
                      placeholder={t.forms.bikesNoteHint}
                      onChange={(event) => patch(bike.id, { note: event.target.value })}
                      className={fieldClass}
                    />
                  </label>
                  <button
                    type="button"
                    className="text-[11px] uppercase tracking-[0.14em] text-mist hover:text-bone"
                    onClick={() => setBikes((current) => current.filter((item) => item.id !== bike.id))}
                  >
                    {t.forms.bikesRemove}
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {bikes.length < MAX_MEMBER_BIKES ? (
          <button
            type="button"
            className="min-h-11 border border-line px-4 text-xs font-semibold uppercase tracking-[0.16em] text-bone"
            onClick={() => setBikes((current) => [...current, newMemberBike()])}
          >
            {t.forms.bikesAdd}
          </button>
        ) : null}

        {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 bg-sodium px-4 text-xs font-semibold uppercase tracking-[0.16em] text-bone disabled:opacity-50"
        >
          {pending ? t.admin.memberSaving : t.forms.bikesSave}
        </button>
      </form>
    </section>
  );
}
