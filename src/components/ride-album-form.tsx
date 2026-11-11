"use client";

import { useActionState } from "react";
import { addRideKeepAction } from "@/app/ride-actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string; ok?: boolean };

export function RideAlbumForm({
  rideId,
  locale,
  t,
}: {
  rideId: string;
  locale: string;
  t: Dictionary;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await addRideKeepAction(formData);
      return result ?? {};
    },
    {},
  );

  return (
    <form action={action} className="mt-6 space-y-4 border border-line bg-rubber p-5">
      <input type="hidden" name="rideId" value={rideId} />
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.groupRides.albumPhotos}
        <input
          type="file"
          name="photos"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="mt-2 block w-full text-sm text-bone file:mr-3 file:border-0 file:bg-sodium file:px-3 file:py-1 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.16em] file:text-bone"
        />
        <span className="mt-2 block text-[11px] normal-case tracking-normal text-mist">
          {t.intranet.groupRides.albumPhotosHint}
        </span>
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.groupRides.albumTrack}
        <input
          type="file"
          name="track"
          accept=".gpx,.kml,application/gpx+xml,application/vnd.google-earth.kml+xml"
          className="mt-2 block w-full text-sm text-bone file:mr-3 file:border-0 file:bg-sodium file:px-3 file:py-1 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.16em] file:text-bone"
        />
        <span className="mt-2 block text-[11px] normal-case tracking-normal text-mist">
          {t.intranet.groupRides.albumTrackHint}
        </span>
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.groupRides.albumLink}
        <input
          type="url"
          name="link"
          placeholder={t.intranet.groupRides.albumLinkHint}
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm normal-case tracking-normal text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.groupRides.albumCaption}
        <input
          type="text"
          name="caption"
          maxLength={280}
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm normal-case tracking-normal text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-sodium px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.intranet.groupRides.albumAdding : t.intranet.groupRides.albumAdd}
      </button>
    </form>
  );
}
