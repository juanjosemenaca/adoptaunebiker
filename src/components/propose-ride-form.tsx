"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createRideAction, updateRideAction } from "@/app/ride-actions";
import { ConfirmSubmit, rideActionClass } from "@/components/confirm-submit";
import { MeetingPinField } from "@/components/meeting-pin-field";
import type { Dictionary } from "@/i18n/types";
import { hrefs } from "@/lib/paths";
import { durationLabel, madridDateParts, RIDE_DURATION_OPTIONS } from "@/lib/ride-helpers";
import type { GroupRide } from "@/lib/types";
import { RIDE_LEVELS, RIDE_SURFACES } from "@/lib/types";

type State = { error?: string };

const fieldClass = "mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";
const labelClass = "block text-[10px] uppercase tracking-[0.18em] text-mist";

function localIso(date: string, time: string) {
  if (!date || !time) return "";
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

export function ProposeRideForm({
  locale,
  t,
  bikes,
  ride,
}: {
  locale: string;
  t: Dictionary;
  bikes: string[];
  ride?: GroupRide;
}) {
  const editing = Boolean(ride);
  const start = ride ? madridDateParts(ride.startsAt) : { date: "", time: "08:00" };
  const bikeOptions = [...bikes];
  if (ride?.hostBike && !bikeOptions.includes(ride.hostBike)) bikeOptions.unshift(ride.hostBike);
  const durations = ride && !RIDE_DURATION_OPTIONS.includes(ride.durationMin as (typeof RIDE_DURATION_OPTIONS)[number])
    ? [ride.durationMin, ...RIDE_DURATION_OPTIONS]
    : [...RIDE_DURATION_OPTIONS];
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const date = String(formData.get("startDate") ?? "");
      const time = String(formData.get("startTime") ?? "");
      formData.set("startsAtIso", localIso(date, time));
      formData.set("startsAt", date && time ? `${date}T${time}` : "");
      const result = editing ? await updateRideAction(formData) : await createRideAction(formData);
      return result ?? {};
    },
    {},
  );
  const links = hrefs(locale);

  return (
    <form action={action} className="mt-8 space-y-5 border border-line bg-rubber p-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startsAtIso" value="" />
      <input type="hidden" name="startsAt" value="" />
      {ride ? <input type="hidden" name="rideId" value={ride.id} /> : null}
      <label className={labelClass}>
        {t.intranet.groupRides.titleField}
        <input
          name="title"
          required
          minLength={3}
          maxLength={80}
          defaultValue={ride?.title}
          placeholder={t.intranet.groupRides.titleHint}
          className={fieldClass}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          {t.intranet.groupRides.startDate}
          <input
            name="startDate"
            type="date"
            required
            defaultValue={start.date}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          {t.intranet.groupRides.startTime}
          <input
            name="startTime"
            type="time"
            required
            defaultValue={start.time}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          {t.intranet.groupRides.duration}
          <select
            name="durationMin"
            required
            defaultValue={String(ride?.durationMin ?? 180)}
            className={fieldClass}
          >
            {durations.map((item) => (
              <option key={item} value={item}>
                {durationLabel(item)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          {t.intranet.groupRides.surface}
          <select name="surface" required defaultValue={ride?.surface ?? "mixto"} className={fieldClass}>
            {RIDE_SURFACES.map((item) => (
              <option key={item} value={item}>
                {t.surfaces[item]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {t.intranet.groupRides.level}
          <select name="level" required defaultValue={ride?.level ?? "dura"} className={fieldClass}>
            {RIDE_LEVELS.map((item) => (
              <option key={item} value={item}>
                {t.rideLevels[item]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {t.intranet.groupRides.hostBike}
          {bikeOptions.length > 0 ? (
            <select
              name="hostBike"
              required
              defaultValue={ride?.hostBike || bikeOptions[0]}
              className={fieldClass}
            >
              {bikeOptions.map((bike) => (
                <option key={bike} value={bike}>
                  {bike}
                </option>
              ))}
            </select>
          ) : (
            <input
              name="hostBikeNew"
              required
              minLength={2}
              maxLength={40}
              placeholder={t.intranet.groupRides.hostBikeNew}
              className={fieldClass}
            />
          )}
        </label>
      </div>
      {bikeOptions.length > 0 ? (
        <label className={labelClass}>
          {t.intranet.groupRides.hostBikeNew}
          <input name="hostBikeNew" maxLength={40} className={fieldClass} />
        </label>
      ) : (
        <p className="text-sm text-mist">
          {t.intranet.groupRides.hostBikeEmpty}{" "}
          <Link href={links.cuenta} className="text-sodium">
            {t.intranet.account}
          </Link>
        </p>
      )}
      <label className={labelClass}>
        {t.intranet.groupRides.place}
        <input
          name="place"
          required
          minLength={2}
          maxLength={80}
          defaultValue={ride?.place}
          placeholder={t.intranet.groupRides.placeHint}
          className={fieldClass}
        />
      </label>
      <MeetingPinField
        locale={locale}
        t={t}
        initialName={ride?.meetingPoint ?? ""}
        initialPin={
          ride?.meetingLat != null && ride.meetingLng != null
            ? { lat: ride.meetingLat, lng: ride.meetingLng }
            : null
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t.intranet.groupRides.distance}
          <input
            name="distanceKm"
            type="number"
            min={5}
            max={400}
            step={1}
            defaultValue={ride?.distanceKm ?? undefined}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          {t.intranet.groupRides.elevation}
          <input
            name="elevationM"
            type="number"
            min={0}
            max={8000}
            step={50}
            defaultValue={ride?.elevationM ?? undefined}
            className={fieldClass}
          />
        </label>
      </div>
      <label className={labelClass}>
        {t.intranet.groupRides.routeUrl}
        <input
          name="routeUrl"
          type="url"
          maxLength={300}
          defaultValue={ride?.routeUrl}
          placeholder={t.intranet.groupRides.routeUrlHint}
          className={fieldClass}
        />
      </label>
      <label className={labelClass}>
        {t.intranet.groupRides.photos}
        <input
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className={fieldClass}
        />
        <span className="mt-2 block text-[11px] normal-case tracking-normal text-mist">
          {t.intranet.groupRides.photosHint}
        </span>
      </label>
      <label className={labelClass}>
        {t.intranet.groupRides.notes}
        <textarea
          name="notes"
          rows={4}
          maxLength={1000}
          defaultValue={ride?.notes}
          placeholder={t.intranet.groupRides.notesHint}
          className={fieldClass}
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      {editing ? (
        <ConfirmSubmit
          message={t.intranet.groupRides.saveConfirm}
          again={t.intranet.groupRides.saveConfirmAgain}
          disabled={pending}
          className={`${rideActionClass} disabled:opacity-60`}
        >
          {pending ? t.intranet.groupRides.sending : t.intranet.groupRides.saveRide}
        </ConfirmSubmit>
      ) : (
        <button type="submit" disabled={pending} className={`${rideActionClass} disabled:opacity-60`}>
          {pending ? t.intranet.groupRides.sending : t.intranet.groupRides.propose}
        </button>
      )}
    </form>
  );
}
