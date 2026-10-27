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
    path: "/comunidad",
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    absoluteTitle: true,
  });
}

export default async function ComunidadPage({
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
  const url = localePath(lang, "/comunidad");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
      <PublicJsonLd
        locale={locale}
        url={url}
        t={t}
        variant="page"
        pageTitle={t.about.pageTitle}
        crumbs={[
          { name: t.nav.home, url: localePath(lang) },
          { name: t.about.pageTitle, url },
        ]}
      />
      <p className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase">{t.nav.community}</p>
      <h1 className="display mt-3 max-w-4xl text-4xl text-bone sm:text-6xl">
        {t.about.pageTitle}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{t.about.lead}</p>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">{t.home.launchNote}</p>
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
            {t.home.ctaOut}
          </HashLink>
        )}
        <Link href={links.home} className="text-sm text-mist hover:text-bone">
          {t.nav.home}
        </Link>
      </div>

      <Apartado title={t.about.ideaTitle}>
        <Subapartado>
          <div className="max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {t.about.idea.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>
      </Apartado>

      <Apartado title={t.about.wantTitle}>
        <ul className="mt-8 grid gap-10 sm:grid-cols-2">
          {t.about.wants.map((item) => (
            <li key={item.title} className="border-t border-line pt-6">
              <h2 className="text-base font-semibold tracking-tight text-bone">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ul>
      </Apartado>

      <Apartado title={t.about.bikeTitle}>
        <Subapartado>
          <div className="max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {t.about.bike.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>
      </Apartado>

      <Apartado title={t.enter.fresh} lead={t.enter.freshLead}>
        <Subapartado>
          <JoinPanel locale={locale} t={t} />
        </Subapartado>
      </Apartado>
    </div>
  );
}
