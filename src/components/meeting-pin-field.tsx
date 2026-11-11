"use client";

import { useState } from "react";
import { MeetingPinMap } from "@/components/meeting-pin-map";
import type { Dictionary } from "@/i18n/types";
import type { MeetingPin } from "@/lib/meeting-pin";

const fieldClass = "mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";
const labelClass = "block text-[10px] uppercase tracking-[0.18em] text-mist";

export function MeetingPinField({
  locale,
  t,
  initialName = "",
  initialPin = null,
}: {
  locale: string;
  t: Dictionary;
  initialName?: string;
  initialPin?: MeetingPin | null;
}) {
  const [name, setName] = useState(initialName);
  const [pin, setPin] = useState<MeetingPin | null>(initialPin);

  return (
    <div className="space-y-3">
      <label className={labelClass}>
        {t.intranet.groupRides.meeting}
        <input
          name="meetingPoint"
          value={name}
          maxLength={120}
          placeholder={t.intranet.groupRides.meetingHint}
          onChange={(event) => setName(event.target.value)}
          className={fieldClass}
        />
      </label>
      <p className="text-sm leading-6 text-mist">{t.intranet.groupRides.meetingMapHint}</p>
      <MeetingPinMap
        pin={pin}
        query={name}
        locale={locale}
        editable
        searchPlaceholder={t.intranet.groupRides.meetingSearch}
        onPin={setPin}
        onPlaceName={setName}
      />
      {pin ? (
        <>
          <input type="hidden" name="meetingLat" value={pin.lat} />
          <input type="hidden" name="meetingLng" value={pin.lng} />
          <button
            type="button"
            className="text-[11px] uppercase tracking-[0.14em] text-mist hover:text-bone"
            onClick={() => setPin(null)}
          >
            {t.intranet.groupRides.meetingClear}
          </button>
        </>
      ) : null}
    </div>
  );
}
