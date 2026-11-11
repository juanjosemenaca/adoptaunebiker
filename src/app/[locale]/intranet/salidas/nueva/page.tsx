import type { Metadata } from "next";
import { ProposeRideForm } from "@/components/propose-ride-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { getMemberById, memberFromSession } from "@/lib/members";
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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const session = await getSession();
  const member = session ? ((await getMemberById(session.id)) ?? memberFromSession(session)) : null;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">{t.intranet.kicker}</p>
      <h1 className="display mt-3 text-6xl">{t.intranet.groupRides.proposeTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.intranet.groupRides.proposeLead}</p>
      <ProposeRideForm locale={locale} t={t} bikes={member?.bikes ?? []} />
    </div>
  );
}
