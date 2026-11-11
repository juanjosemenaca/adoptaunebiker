import Link from "next/link";
import { archiveRideAction, purgeRideAction } from "@/app/ride-actions";
import { ConfirmSubmit, rideActionClass } from "@/components/confirm-submit";
import type { Dictionary } from "@/i18n/types";

export function RideKeepActions({
  rideId,
  locale,
  reuseHref,
  canReuse,
  canArchive,
  canPurge,
  t,
}: {
  rideId: string;
  locale: string;
  reuseHref: string;
  canReuse: boolean;
  canArchive: boolean;
  canPurge: boolean;
  t: Dictionary;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {canReuse ? (
        <Link href={reuseHref} className={rideActionClass}>
          {t.intranet.groupRides.reuseRide}
        </Link>
      ) : null}
      {canArchive ? (
        <form action={archiveRideAction}>
          <input type="hidden" name="rideId" value={rideId} />
          <input type="hidden" name="locale" value={locale} />
          <ConfirmSubmit
            message={t.intranet.groupRides.archiveConfirm}
            again={t.intranet.groupRides.archiveConfirmAgain}
            className={rideActionClass}
          >
            {t.intranet.groupRides.archiveRide}
          </ConfirmSubmit>
        </form>
      ) : null}
      {canPurge ? (
        <form action={purgeRideAction}>
          <input type="hidden" name="rideId" value={rideId} />
          <input type="hidden" name="locale" value={locale} />
          <ConfirmSubmit
            message={t.intranet.groupRides.deleteForeverConfirm}
            again={t.intranet.groupRides.deleteForeverAgain}
            className={rideActionClass}
          >
            {t.intranet.groupRides.deleteForever}
          </ConfirmSubmit>
        </form>
      ) : null}
    </div>
  );
}
