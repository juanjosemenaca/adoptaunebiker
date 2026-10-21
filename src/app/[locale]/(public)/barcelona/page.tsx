import type { Metadata } from "next";
import Link from "next/link";
import { HashLink } from "@/components/hash-link";
import { JoinPanel } from "@/components/join-panel";
import { Apartado, Subapartado } from "@/components/public-blocks";
import { PublicJsonLd } from "@/components/public-json-ld";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";
import { analyticsEvents } from "@/lib/analytics";
import { anchors, hrefs } from "@/lib/paths";
import { getSession } from "@/lib/session";
import { publicMetadata } from "@/lib/seo";
import { localePath } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return publicMetadata({
    locale,
    path: "/barcelona",
    title: t.barcelona.metaTitle,
    description: t.barcelona.metaDescription,
    absoluteTitle: true,
  });
}

export default async function BarcelonaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const session = await getSession();
  const lang = isLocale(locale) ? locale : "es";
  const links = hrefs(locale);
  const jump = anchors();
  const url = localePath(lang, "/barcelona");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-5">
      <PublicJsonLd
        locale={locale}
        url={url}
        t={t}
        variant="page"
        pageTitle={t.barcelona.title}
        crumbs={[
          { name: t.nav.home, url: localePath(lang) },
          { name: t.barcelona.title, url },
        ]}
      />
      <p className="text-[10px] uppercase tracking-[0.22em] text-sodium">{t.nav.barcelona}</p>
      <h1 className="display mt-3 max-w-4xl text-5xl text-bone sm:text-7xl">
        {t.barcelona.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{t.barcelona.lead}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {session ? (
          <Link
            href={links.intranet}
            className="inline-flex min-h-11 items-center justify-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
          >
            {t.home.ctaIn}
          </Link>
        ) : (
          <HashLink
            href={jump.join}
            eventName={analyticsEvents.signUpCtaClick}
            className="inline-flex min-h-11 items-center justify-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
          >
            {t.barcelona.start}
          </HashLink>
        )}
        <Link
          href={links.principiante}
          className="inline-flex min-h-11 items-center justify-center border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        >
          {t.nav.beginner}
        </Link>
        <Link
          href={links.veterano}
          className="inline-flex min-h-11 items-center justify-center border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        >
          {t.nav.veteran}
        </Link>
      </div>

      <Apartado title={t.home.offerTitle}>
        <Subapartado>
          <div className="max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {t.barcelona.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>
      </Apartado>

      <Apartado title={t.barcelona.coverageTitle} lead={t.barcelona.coverage} />

      <Apartado title={t.barcelona.emptyTitle} lead={t.barcelona.empty} />

      <Apartado title={t.home.matchTitle}>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {t.home.matchItems.map((item, index) => (
            <li key={item.title} className="border border-line bg-rubber p-5">
              <p className="display text-3xl text-sodium">0{index + 1}</p>
              <h2 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-mist">{item.body}</p>
            </li>
          ))}
        </ol>
      </Apartado>

      <Apartado title={t.enter.fresh} lead={t.enter.freshLead}>
        <Subapartado>
          <JoinPanel locale={locale} t={t} session={session} heading={t.barcelona.start} />
        </Subapartado>
      </Apartado>
    </div>
  );
}
