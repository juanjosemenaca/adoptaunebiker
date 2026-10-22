import Link from "next/link";
import { HashLink } from "@/components/hash-link";
import { JoinPanel } from "@/components/join-panel";
import { Apartado, PlazaCallout, Subapartado } from "@/components/public-blocks";
import { PublicJsonLd } from "@/components/public-json-ld";
import { analyticsEvents } from "@/lib/analytics";
import { isLocale } from "@/i18n/config";
import { anchors, hrefs } from "@/lib/paths";
import { localePath } from "@/lib/site";
import type { Dictionary } from "@/i18n/types";
import type { SessionUser } from "@/lib/types";

export function AudienceLanding({
  locale,
  t,
  session,
  path,
  title,
  lead,
  heading,
  paragraphs,
  calloutKicker,
  points,
  cta,
}: {
  locale: string;
  t: Dictionary;
  session: SessionUser | null;
  path: string;
  title: string;
  lead: string;
  heading: string;
  paragraphs: readonly string[];
  calloutKicker: string;
  points: readonly string[];
  cta: string;
}) {
  const lang = isLocale(locale) ? locale : "es";
  const links = hrefs(locale);
  const jump = anchors();
  const url = localePath(lang, path);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
      <PublicJsonLd
        locale={locale}
        url={url}
        t={t}
        variant="page"
        pageTitle={title}
        crumbs={[
          { name: t.nav.home, url: localePath(lang) },
          { name: title, url },
        ]}
      />
      <p className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase">Adopta un eBiker</p>
      <h1 className="display mt-3 max-w-4xl text-4xl text-bone sm:text-6xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{lead}</p>
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
            {cta}
          </HashLink>
        )}
        <Link href={links.home} className="text-sm text-mist hover:text-bone">
          {t.nav.home}
        </Link>
      </div>

      <Apartado title={heading}>
        <Subapartado>
          <div className="max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>
        <Subapartado>
          <PlazaCallout
            kicker={calloutKicker}
            points={points}
            href={jump.join}
            cta={cta}
          />
        </Subapartado>
      </Apartado>

      <Apartado title={t.home.matchTitle}>
        <ol className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-0">
          {t.home.matchItems.map((item, index) => (
            <li
              key={item.title}
              className={index === 0 ? "sm:pr-8" : "sm:border-l sm:border-line sm:px-8"}
            >
              <p className="display text-5xl text-mist/45">{index + 1}</p>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-bone">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ol>
      </Apartado>

      <Apartado title={t.enter.fresh} lead={t.enter.freshLead}>
        <Subapartado>
          <JoinPanel locale={locale} t={t} session={session} />
        </Subapartado>
      </Apartado>
    </div>
  );
}
