import type { Metadata } from "next";
import { ProposeRideForm } from "@/components/propose-ride-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { getMemberById, memberFromSession } from "@/lib/members";
import { canReuseRide, getMyRideRequest, getRide } from "@/lib/rides";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.intranet.groupRides.proposeTitle,
    robots: { index: false, follow: false },
  };
}

export default async function NewRidePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ desde?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = getDictionary(locale);
  const session = await getSession();
  const member = session ? ((await getMemberById(session.id)) ?? memberFromSession(session)) : null;
  let source = null;
  if (session && query.desde) {
    const ride = await getRide(query.desde);
    const mine = ride ? await getMyRideRequest(ride.id, session.id) : null;
    if (
      ride &&
      canReuseRide({
        userId: session.id,
        hostId: ride.hostId,
        status: ride.status,
        joinStatus: mine?.status ?? null,
        startsAt: ride.startsAt,
      })
    ) {
      source = ride;
    }
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">{t.intranet.kicker}</p>
      <h1 className="display mt-3 text-6xl">
        {source ? t.intranet.groupRides.reuseTitle : t.intranet.groupRides.proposeTitle}
      </h1>
      <p className="mt-4 max-w-xl text-mist">
        {source ? t.intranet.groupRides.reuseLead : t.intranet.groupRides.proposeLead}
      </p>
      <ProposeRideForm locale={locale} t={t} bikes={member?.bikes ?? []} source={source ?? undefined} />
    </div>
  );
}
