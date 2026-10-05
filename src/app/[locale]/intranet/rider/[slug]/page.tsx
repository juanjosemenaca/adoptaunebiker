import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { riders } from "@/data/riders";
import { AdoptForm } from "@/components/adopt-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs, loginHref } from "@/lib/paths";
import { findRider, getBonds, getSession } from "@/lib/session";

export function generateStaticParams() {
  return riders.map((rider) => ({ slug: rider.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const rider = await findRider(slug);
  const t = getDictionary(locale);
  if (!rider) return { title: t.intranet.card, robots: { index: false, follow: false } };
  return {
    title: rider.name,
    description: `${rider.city} · ${rider.bike} · ${rider.discipline}`,
    robots: { index: false, follow: false },
  };
}

export default async function RiderPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const rider = await findRider(slug);
  if (!rider) notFound();
  const t = getDictionary(locale);
  const links = hrefs(locale);

  const session = await getSession();
  const bonds = await getBonds();
  const existing = session
    ? bonds.find(
        (bond) =>
          (bond.fromId === session.id && bond.toId === rider.id) ||
          (bond.fromId === rider.id && bond.toId === session.id),
      )
    : undefined;
  const isSelf = session?.id === rider.id;
  const isMentor = rider.role === "mentor";

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
      <article>
        <p
          className={`text-[11px] uppercase tracking-[0.28em] ${isMentor ? "text-sodium" : "text-volt"}`}
        >
          {isMentor ? t.roles.mentor : t.roles.beginner} ·{" "}
          {t.disciplines[rider.discipline]} · {rider.city}
        </p>
        <h1 className="display mt-3 text-6xl sm:text-8xl">{rider.name}</h1>
        <p className="plate mt-4 text-mist">{rider.plate}</p>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-bone/90">{rider.bio}</p>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-mist">
          {t.intranet.looksFor} {rider.lookingFor}
        </p>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-mist">
              {t.intranet.bike}
            </dt>
            <dd className="mt-1 text-sm">{rider.bike}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-mist">
              {t.intranet.km}
            </dt>
            <dd className="display mt-1 text-3xl">{rider.kmMonth}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-mist">
              {t.intranet.years}
            </dt>
            <dd className="display mt-1 text-3xl">{rider.years}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          {rider.tags.map((tag) => (
            <span
              key={tag}
              className="border border-line px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-mist"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>

      <aside className="h-fit border border-line bg-rubber p-6">
        <h2 className="display text-4xl">{t.intranet.adoption}</h2>
        {isSelf ? (
          <p className="mt-4 text-sm text-mist">{t.intranet.self}</p>
        ) : existing && existing.status !== "declined" ? (
          <p className="mt-4 text-sm text-mist">
            {existing.status === "accepted"
              ? t.intranet.bondAccepted
              : t.intranet.bondPending}
            {existing.message ? ` “${existing.message}”` : ""}
          </p>
        ) : session ? (
          <AdoptForm toId={rider.id} toName={rider.name} locale={locale} t={t} />
        ) : (
          <p className="mt-4 text-sm leading-6 text-mist">
            {t.intranet.loginToAsk}{" "}
            <Link href={loginHref(locale, links.intranet)} className="text-sodium">
              {t.intranet.howToEnter}
            </Link>
            .
          </p>
        )}
      </aside>
    </div>
  );
}
