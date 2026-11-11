import type { Metadata } from "next";
import Link from "next/link";
import { GroupRideCard } from "@/components/group-ride-card";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/types";
import { hrefs } from "@/lib/paths";
import { splitUpcomingPast } from "@/lib/ride-helpers";
import { listHostedRides } from "@/lib/rides";
import { getSession } from "@/lib/session";
import type { GroupRide } from "@/lib/types";

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

export default async function HostedRidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const hosted = await listHostedRides(session.id);
  const { upcoming, past } = splitUpcomingPast(hosted);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">{t.intranet.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.intranet.hostedTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.intranet.hostedLead}</p>

      {hosted.length === 0 ? (
        <p className="mt-10 text-mist">
          {t.intranet.hostedEmpty}{" "}
          <Link href={links.rideNew} className="text-sodium">
            {t.intranet.proposeRide}
          </Link>
        </p>
      ) : (
        <>
          <RideSection
            title={t.intranet.groupRides.upcomingSection}
            empty={t.intranet.groupRides.emptyUpcoming}
            rides={upcoming}
            locale={locale}
            t={t}
            hrefFor={links.ride}
          />
          <RideSection
            title={t.intranet.groupRides.pastSection}
            empty={t.intranet.groupRides.emptyPast}
            rides={past}
            locale={locale}
            t={t}
            hrefFor={links.ride}
          />
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
