import type { Metadata } from "next";
import Link from "next/link";
import { GroupRideCard } from "@/components/group-ride-card";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/types";
import { hrefs } from "@/lib/paths";
import { isUpcomingRide } from "@/lib/ride-helpers";
import { listMyJoinRequests } from "@/lib/rides";
import { getSession } from "@/lib/session";
import type { GroupRide, RideJoinStatus } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.intranet.groupRides.joinedTitle,
    description: t.intranet.groupRides.joinedLead,
    robots: { index: false, follow: false },
  };
}

export default async function JoinedRidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const mine = await listMyJoinRequests(session.id);
  const withRide = mine.filter((item): item is typeof item & { ride: GroupRide } => Boolean(item.ride));
  const upcoming = withRide
    .filter((item) => item.status === "accepted" && isUpcomingRide(item.ride))
    .sort((a, b) => a.ride.startsAt.localeCompare(b.ride.startsAt));
  const pending = withRide
    .filter((item) => item.status === "pending" && isUpcomingRide(item.ride))
    .sort((a, b) => a.ride.startsAt.localeCompare(b.ride.startsAt));
  const gone = withRide
    .filter((item) => item.status === "accepted" && !isUpcomingRide(item.ride))
    .sort((a, b) => b.ride.startsAt.localeCompare(a.ride.startsAt));
  const other = withRide.filter((item) => {
    if (item.status === "declined" || item.status === "cancelled") return true;
    return item.status === "pending" && !isUpcomingRide(item.ride);
  });
  const statusLabel: Record<RideJoinStatus, string> = {
    pending: t.intranet.pending,
    accepted: t.intranet.accepted,
    declined: t.intranet.declined,
    cancelled: t.intranet.groupRides.cancelled,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">{t.intranet.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.intranet.groupRides.joinedTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.intranet.groupRides.joinedLead}</p>

      {mine.length === 0 ? (
        <p className="mt-10 text-mist">
          {t.intranet.groupRides.emptyJoined}{" "}
          <Link href={links.intranet} className="text-sodium">
            {t.intranet.seeRides}
          </Link>
        </p>
      ) : (
        <>
          <RideSection
            title={t.intranet.groupRides.upcomingSection}
            empty={t.intranet.groupRides.emptyAccepted}
            rides={upcoming.map((item) => item.ride)}
            locale={locale}
            t={t}
            hrefFor={links.ride}
          />
          <RideSection
            title={t.intranet.groupRides.pendingSection}
            empty={t.intranet.groupRides.emptyPending}
            rides={pending.map((item) => item.ride)}
            locale={locale}
            t={t}
            hrefFor={links.ride}
          />
          {gone.length > 0 ? (
            <RideSection
              title={t.intranet.groupRides.joinedPastSection}
              empty={t.intranet.groupRides.emptyPast}
              rides={gone.map((item) => item.ride)}
              locale={locale}
              t={t}
              hrefFor={links.ride}
            />
          ) : null}
        </>
      )}

      {other.length > 0 ? (
        <section className="mt-12">
          <h2 className="display text-4xl">{t.intranet.groupRides.otherSection}</h2>
          <ul className="mt-4 divide-y divide-line border border-line bg-rubber">
            {other.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <Link href={links.ride(item.rideId)} className="text-sm text-bone hover:text-sodium">
                  {item.ride?.title ?? t.intranet.groupRides.title}
                </Link>
                <span className="text-[11px] uppercase tracking-[0.14em] text-mist">
                  {statusLabel[item.status]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function RideSection({
  title,
  empty,
  rides,
  locale,
  t,
  hrefFor,
}: {
  title: string;
  empty: string;
  rides: GroupRide[];
  locale: string;
  t: Dictionary;
  hrefFor: (id: string) => string;
}) {
  return (
    <section className="mt-12">
      <h2 className="display text-4xl">{title}</h2>
      {rides.length === 0 ? (
        <p className="mt-3 text-sm text-mist">{empty}</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {rides.map((ride) => (
            <GroupRideCard
              key={ride.id}
              ride={ride}
              href={hrefFor(ride.id)}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      )}
    </section>
  );
}
