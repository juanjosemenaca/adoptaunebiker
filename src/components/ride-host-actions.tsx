import { cancelRideAction } from "@/app/ride-actions";
import { ConfirmSubmit, rideActionClass } from "@/components/confirm-submit";
import type { Dictionary } from "@/i18n/types";

export function RideHostActions({
  rideId,
  locale,
  editHref,
  t,
}: {
  rideId: string;
  locale: string;
  editHref: string;
  t: Dictionary;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <ConfirmSubmit
        href={editHref}
        message={t.intranet.groupRides.editConfirm}
        again={t.intranet.groupRides.editConfirmAgain}
        className={rideActionClass}
      >
        {t.intranet.groupRides.editRide}
      </ConfirmSubmit>
      <form action={cancelRideAction}>
        <input type="hidden" name="rideId" value={rideId} />
        <input type="hidden" name="locale" value={locale} />
        <ConfirmSubmit
          message={t.intranet.groupRides.cancelConfirm}
          again={t.intranet.groupRides.cancelConfirmAgain}
          className={rideActionClass}
        >
          {t.intranet.groupRides.cancelRide}
        </ConfirmSubmit>
      </form>
    </div>
  );
}
