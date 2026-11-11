import Link from "next/link";
import { fill } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/types";
import { durationLabel, isRideFull, isRidePast, rideStamp } from "@/lib/ride-helpers";
import type { GroupRide, RideMark } from "@/lib/types";
import { dateLocale } from "@/i18n/config";

export function GroupRideCard({
  ride,
  href,
  locale,
  t,
  mark,
}: {
  ride: GroupRide;
  href?: string;
  locale: string;
  t: Dictionary;
  mark?: RideMark;
}) {
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  const full = isRideFull(ride.acceptedCount, ride.maxRiders);
  const className = `flex h-full flex-col border border-line bg-rubber p-5 ${
    href ? "transition-colors hover:border-sodium" : ""
  }`;
  const markLabel =
    mark === "hosted"
      ? t.intranet.groupRides.markHosted
      : mark === "joined"
        ? t.intranet.groupRides.markJoined
        : "";
  const inner = (
    <>
      {markLabel ? (
        <p className={`text-[10px] uppercase tracking-[0.18em] ${mark === "hosted" ? "text-volt" : "text-sodium"}`}>
          {markLabel}
        </p>
      ) : null}
      {ride.photoUrls[0] ? (
        <img src={ride.photoUrls[0]} alt="" className="mb-3 h-36 w-full object-cover" />
      ) : null}
      <p className="text-[10px] uppercase tracking-[0.18em] text-mist">
        {rideStamp(ride.startsAt, lang)} · {durationLabel(ride.durationMin)}
        {ride.distanceKm
          ? ` · ${fill(t.intranet.groupRides.distanceKm, { n: ride.distanceKm })}`
          : ""}
        {ride.elevationM != null && ride.elevationM > 0
          ? ` · ${fill(t.intranet.groupRides.elevationM, { n: ride.elevationM })}`
          : ""}
      </p>
      <h2 className="mt-2 text-lg text-bone">{ride.title}</h2>
      <p className="mt-2 text-sm text-mist">
        {t.surfaces[ride.surface]} · {t.rideLevels[ride.level]}
        {ride.hostBike ? ` · ${ride.hostBike}` : ""}
      </p>
      <p className="mt-1 text-sm text-bone">{ride.place}</p>
      {ride.meetingPoint ? <p className="mt-1 text-sm text-mist">{ride.meetingPoint}</p> : null}
      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-mist">
        {fill(t.intranet.groupRides.hostedBy, { name: ride.hostName || t.intranet.cyclist })}
        {" · "}
        {ride.status === "cancelled"
          ? t.intranet.groupRides.cancelled
          : isRidePast(ride.startsAt)
            ? t.intranet.groupRides.done
            : full
              ? t.intranet.groupRides.full
              : fill(t.intranet.groupRides.spots, { n: ride.acceptedCount + 1 })}
      </p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return <article className={className}>{inner}</article>;
}
