import type { Metadata } from "next";
import Link from "next/link";
import { GroupRideCard } from "@/components/group-ride-card";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/types";
import { hrefs } from "@/lib/paths";
import { listRideHides } from "@/lib/ride-dismissals";
import { partitionMyRides } from "@/lib/ride-helpers";
import { listHostedRides, listMyJoinRequests } from "@/lib/rides";
import { getSession } from "@/lib/session";
import type { GroupRide, RideMark } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.intranet.hostedTitle,
    description: t.intranet.hostedLead,
    robots: { index: false, follow: false },
  };
}

export default async function MyRidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const [hosted, mine, hides] = await Promise.all([
    listHostedRides(session.id),
    listMyJoinRequests(session.id),
    listRideHides(),
  ]);
  const { hostedUpcoming, going, pending, done, removed } = partitionMyRides(
    hosted,
    mine,
    undefined,
    hides,
  );
  const empty =
    hostedUpcoming.length + going.length + pending.length + done.length + removed.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">{t.intranet.kicker}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-6xl sm:text-7xl">{t.intranet.hostedTitle}</h1>
          <p className="mt-4 max-w-xl text-mist">{t.intranet.hostedLead}</p>
        </div>
        <Link
          href={links.rideNew}
          className="inline-flex min-h-11 items-center bg-sodium px-4 text-[11px] font-semibold tracking-[0.16em] uppercase text-bone"
        >
          {t.intranet.proposeRide}
        </Link>
      </div>

      {empty ? (
        <p className="mt-10 text-mist">
          {t.intranet.hostedEmpty}{" "}
          <Link href={links.intranet} className="text-sodium">
            {t.intranet.seeRides}
          </Link>
        </p>
      ) : (
        <>
          <RideSection
            title={t.intranet.groupRides.hostedUpcomingSection}
            empty={t.intranet.groupRides.emptyUpcoming}
            rides={hostedUpcoming}
            mark="hosted"
            locale={locale}
            t={t}
            hrefFor={links.ride}
          />
          <RideSection
            title={t.intranet.groupRides.goingSection}
            empty={t.intranet.groupRides.emptyAccepted}
            rides={going}
            mark="joined"
            locale={locale}
            t={t}
            hrefFor={links.ride}
          />
          {pending.length > 0 ? (
            <RideSection
              title={t.intranet.groupRides.pendingSection}
              empty={t.intranet.groupRides.emptyPending}
              rides={pending}
              mark="joined"
              locale={locale}
              t={t}
              hrefFor={links.ride}
            />
          ) : null}
          <RideSection
            title={t.intranet.groupRides.doneSection}
            empty={t.intranet.groupRides.emptyPast}
            rides={done}
            markFor={(ride) => (ride.hostId === session.id ? "hosted" : "joined")}
            locale={locale}
            t={t}
            hrefFor={links.ride}
          />
          {removed.length > 0 ? (
            <RideSection
              title={t.intranet.groupRides.removedSection}
              empty={t.intranet.groupRides.emptyRemoved}
              rides={removed}
              markFor={(ride) => (ride.hostId === session.id ? "hosted" : "joined")}
              locale={locale}
              t={t}
              hrefFor={links.ride}
            />
          ) : null}
        </>
      )}
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
  mark,
  markFor,
}: {
  title: string;
  empty: string;
  rides: GroupRide[];
  locale: string;
  t: Dictionary;
  hrefFor: (id: string) => string;
  mark?: RideMark;
  markFor?: (ride: GroupRide) => RideMark;
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
              mark={markFor ? markFor(ride) : mark}
            />
          ))}
        </div>
      )}
    </section>
  );
}
