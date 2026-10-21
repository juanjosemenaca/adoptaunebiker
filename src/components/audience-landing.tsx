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
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-5">
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
      <p className="text-[10px] uppercase tracking-[0.22em] text-sodium">Adopta un eBiker</p>
      <h1 className="display mt-3 max-w-4xl text-5xl text-bone sm:text-7xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{lead}</p>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">{t.home.launchNote}</p>
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
            {cta}
          </HashLink>
        )}
        <Link
          href={links.home}
          className="inline-flex min-h-11 items-center justify-center border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        >
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
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {t.home.matchItems.map((item, index) => (
            <li key={item.title} className="border border-line bg-rubber p-5">
              <p className="display text-3xl text-sodium">0{index + 1}</p>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-mist">{item.body}</p>
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
