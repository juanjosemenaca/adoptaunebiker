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
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
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
      <p className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase">{t.nav.barcelona}</p>
      <h1 className="display mt-3 max-w-4xl text-4xl text-bone sm:text-6xl">
        {t.barcelona.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{t.barcelona.lead}</p>
      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        {session ? (
          <Link href={links.intranet} className="public-cta">
            {t.home.ctaIn}
          </Link>
        ) : (
          <HashLink
            href={jump.join}
            eventName={analyticsEvents.signUpCtaClick}
            className="public-cta"
          >
            {t.barcelona.start}
          </HashLink>
        )}
        <Link href={links.principiante} className="text-sm text-mist hover:text-bone">
          {t.nav.beginner}
        </Link>
        <Link href={links.veterano} className="text-sm text-mist hover:text-bone">
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
        <ol className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-0">
          {t.home.matchItems.map((item, index) => (
            <li
              key={item.title}
              className={index === 0 ? "sm:pr-8" : "sm:border-l sm:border-line sm:px-8"}
            >
              <p className="display text-5xl text-mist/45">{index + 1}</p>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-bone">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ol>
      </Apartado>

      <Apartado title={t.enter.fresh} lead={t.enter.freshLead}>
        <Subapartado>
          <JoinPanel locale={locale} t={t} heading={t.barcelona.start} />
        </Subapartado>
      </Apartado>
    </div>
  );
}
