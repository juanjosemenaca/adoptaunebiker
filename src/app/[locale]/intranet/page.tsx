import Link from "next/link";
import { RiderCard } from "@/components/rider-card";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";
import { getBonds, getSession, listRiders } from "@/lib/session";

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

  const [riders, bonds] = await Promise.all([listRiders(), getBonds()]);
  const incoming = bonds.filter(
    (bond) => bond.toId === session.id && bond.status === "pending",
  );
  const accepted = bonds.filter(
    (bond) =>
      bond.status === "accepted" &&
      (bond.fromId === session.id || bond.toId === session.id),
  );
  const matches = riders
    .filter(
      (rider) =>
        rider.id !== session.id &&
        rider.role !== session.role &&
        rider.discipline === session.discipline,
    )
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.intranet.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">
        {fill(t.intranet.hello, { name: session.name })}
      </h1>
      <p className="mt-4 max-w-xl text-mist">
        {fill(t.intranet.intro, {
          role: session.role === "mentor" ? t.roles.mentor : t.roles.beginner,
          discipline: t.disciplines[session.discipline],
          city: session.city,
        })}
      </p>

      <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-6 border-t border-line pt-6">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.2em] text-mist">
            {t.intranet.asked}
          </dt>
          <dd className="display mt-1 text-4xl">{incoming.length}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.2em] text-mist">
            {t.intranet.bonds}
          </dt>
          <dd className="display mt-1 text-4xl">{accepted.length}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={links.explorar}
          className="bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        >
          {t.intranet.seePeloton}
        </Link>
        <Link
          href={links.cuenta}
          className="border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        >
          {t.intranet.account}
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="display text-5xl">{t.intranet.modality}</h2>
        <p className="mt-3 max-w-xl text-sm text-mist">
          {session.role === "mentor" ? t.intranet.seekers : t.intranet.guides}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {matches.map((rider) => (
            <RiderCard key={rider.id} rider={rider} locale={locale} t={t} />
          ))}
        </div>
        {matches.length === 0 ? (
          <p className="mt-6 text-mist">
            {fill(t.intranet.empty, { discipline: t.disciplines[session.discipline] })}
          </p>
        ) : null}
      </section>
    </div>
  );
}
