import type { Metadata } from "next";
import { GroupRideCard } from "@/components/group-ride-card";
import { getDictionary } from "@/i18n/get-dictionary";
import { listOpenRides } from "@/lib/rides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.admin.meetupsTitle, robots: { index: false, follow: false } };
}

export default async function AdminMeetupsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const rides = await listOpenRides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.meetupsTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.meetupsLead}</p>

      {rides.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.meetupsEmpty}</p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {rides.map((ride) => (
            <GroupRideCard key={ride.id} ride={ride} locale={locale} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
