import Link from "next/link";
import { GroupRideCalendar } from "@/components/group-ride-calendar";
import { IntranetNoticeList } from "@/components/intranet-notice-list";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { listIntranetNotices } from "@/lib/intranet-notices";
import { hrefs } from "@/lib/paths";
import { joinedRideIds, rideMark } from "@/lib/ride-helpers";
import { listMyJoinRequests, listOpenRides } from "@/lib/rides";
import { getSession } from "@/lib/session";

export default async function IntranetHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);

  const [rides, mine, notices] = await Promise.all([
    listOpenRides(),
    listMyJoinRequests(session.id),
    listIntranetNotices(),
  ]);
  const joinedIds = joinedRideIds(mine);
  const marked = rides.map((ride) => ({
    ...ride,
    href: links.ride(ride.id),
    mark: rideMark(ride, session.id, joinedIds),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.intranet.kicker}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-6xl sm:text-7xl">{t.nav.panel}</h1>
          <p className="mt-4 max-w-xl text-mist">
            {fill(t.intranet.intro, {
              role: session.role === "mentor" ? t.roles.mentor : t.roles.beginner,
              discipline: t.disciplines[session.discipline],
              city: session.city,
            })}
          </p>
        </div>
        <Link
          href={links.rideNew}
          className="inline-flex min-h-11 items-center bg-sodium px-4 text-[11px] font-semibold tracking-[0.16em] uppercase text-bone"
        >
          {t.intranet.proposeRide}
        </Link>
      </div>

      <IntranetNoticeList notices={notices} locale={locale} t={t} />

      <div className="mt-10">
        <GroupRideCalendar rides={marked} locale={locale} t={t} />
      </div>
    </div>
  );
}
