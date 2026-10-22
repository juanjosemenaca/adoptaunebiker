import Link from "next/link";
import { Faq } from "@/components/faq";
import { HashLink } from "@/components/hash-link";
import { JoinPanel } from "@/components/join-panel";
import { Apartado } from "@/components/public-blocks";
import { PublicFold } from "@/components/public-fold";
import { PublicCtaIcon } from "@/components/public-cta-icon";
import { PublicJsonLd } from "@/components/public-json-ld";
import { PublicPhoto } from "@/components/public-photo";
import { analyticsEvents } from "@/lib/analytics";
import { isLocale } from "@/i18n/config";
import { anchors, hrefs } from "@/lib/paths";
import { localePath } from "@/lib/site";
import type { Dictionary } from "@/i18n/types";
import type { SessionUser } from "@/lib/types";

const valueIcons = [
  <PeopleIcon key="people" />,
  <HeartIcon key="heart" />,
  <LeafIcon key="leaf" />,
  <PeakIcon key="peak" />,
];

const stepIcons = [<DocIcon key="doc" />, <ShieldIcon key="shield" />, <PeopleIcon key="step-people" />];

function bikeIconFor(tag: string) {
  const key = tag.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (key.includes("gravel")) return <PeakIcon />;
  if (key.includes("mtb") || key.includes("vtt")) return <TreesIcon />;
  if (key.includes("electr")) return <BoltIcon />;
  return <RoadIcon />;
}

export function PublicLanding({
  locale,
  t,
  session,
}: {
  locale: string;
  t: Dictionary;
  session: SessionUser | null;
}) {
  const links = hrefs(locale);
  const jump = anchors();
  const joinCta = session ? (
    <Link href={links.intranet} className="public-cta">
      {t.home.ctaIn}
      <PublicCtaIcon />
    </Link>
  ) : (
    <HashLink href={jump.join} eventName={analyticsEvents.signUpCtaClick} className="public-cta">
      {t.home.ctaOut}
      <PublicCtaIcon />
    </HashLink>
  );
  const shortJoinCta = session ? (
    <Link href={links.intranet} className="public-cta">
      {t.home.ctaIn}
      <PublicCtaIcon />
    </Link>
  ) : (
    <HashLink href={jump.join} eventName={analyticsEvents.signUpCtaClick} className="public-cta">
      {t.home.ctaOutShort}
      <PublicCtaIcon />
    </HashLink>
  );

  return (
    <div>
      <PublicJsonLd
        locale={locale}
        url={localePath(isLocale(locale) ? locale : "es")}
        t={t}
        variant="home"
      />

      <section id="inicio" className="scroll-mt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-10 pb-10 sm:gap-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pt-14 lg:pb-14">
          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-xs font-medium tracking-[0.2em] text-mist uppercase">
              {t.home.brandGloss}
            </p>
            <h1 className="display mt-5 max-w-xl text-[clamp(2.15rem,5vw,3.85rem)] text-bone">
              {t.home.line1}
              <br />
              {t.home.line2}
              <br />
              <span className="public-accent public-underline">{t.home.line3}</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-mist sm:text-[1.05rem]">
              {t.home.lead}
            </p>
            <div className="mt-8">{joinCta}</div>
            <p className="mt-5 flex max-w-md items-start gap-2 text-sm leading-6 text-mist">
              <PinIcon />
              <span>{t.home.joinMeta}</span>
            </p>
          </div>
          <div className="relative min-w-0 overflow-hidden aspect-[4/3]">
            <PublicPhoto slot="hero" priority className="object-[center_88%]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />
            <p className="display absolute top-5 right-5 max-w-[9.5rem] text-right text-sm leading-5 text-white sm:top-7 sm:right-7 sm:text-base">
              {t.footer.blurb
                .split(/(?<=\.)\s+/)
                .slice(0, 2)
                .map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </section>

      <ul className="mx-auto grid max-w-7xl grid-cols-1 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {t.home.welcomeTags.map((tag) => (
          <li
            key={tag}
            className="flex min-h-20 items-center gap-4 border-line px-6 py-6 text-base text-bone sm:min-h-24 sm:text-lg max-sm:border-b sm:max-lg:odd:border-r sm:max-lg:[&:nth-child(-n+2)]:border-b lg:border-r lg:last:border-r-0"
          >
            <span className="public-accent [&>svg]:h-7 [&>svg]:w-7">{bikeIconFor(tag)}</span>
            <span className="font-medium tracking-tight">{tag}</span>
          </li>
        ))}
      </ul>

      <section id="entrar" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium tracking-[0.2em] text-mist uppercase">{t.nav.how}</p>
        <h2 className="display mt-4 max-w-lg text-4xl text-bone sm:text-5xl">{t.home.howTitle}</h2>
        <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
          {t.home.matchItems.map((item, index) => (
            <li key={item.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-lg font-semibold text-bone">
                  {index + 1}
                </span>
                <span className="public-accent">{stepIcons[index]}</span>
                {index < 2 ? (
                  <span className="ml-auto hidden text-mist md:inline" aria-hidden>
                    →
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-bone">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <section
            id="principiante"
            className="grid scroll-mt-28 items-center gap-8 border-l-4 border-[var(--public-accent)] bg-rubber px-4 py-16 sm:grid-cols-[0.85fr_1.15fr] sm:px-6 sm:py-20"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-panel">
              <PublicPhoto slot="beginner" className="object-[center_40%]" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-mist uppercase">
                {t.roles.beginner}
              </p>
              <h2 className="display mt-3 text-3xl text-bone sm:text-[2.25rem]">
                {t.home.beginnerTitle}
              </h2>
              <p className="mt-4 max-w-sm text-base leading-7 text-mist">{t.beginner.lead}</p>
              <div className="mt-8">{shortJoinCta}</div>
            </div>
          </section>
          <section
            id="veterano"
            className="grid scroll-mt-28 items-center gap-8 bg-[var(--graphite)] px-4 py-16 text-asphalt sm:grid-cols-[1.15fr_0.85fr] sm:px-6 sm:py-20"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-asphalt/60 uppercase">
                {t.roles.mentor}
              </p>
              <h2 className="display mt-3 text-3xl sm:text-[2.25rem]">{t.home.veteranTitle}</h2>
              <p className="mt-4 max-w-sm text-base leading-7 text-asphalt/80">{t.veteran.lead}</p>
              <div className="mt-8">{shortJoinCta}</div>
            </div>
            <div className="relative order-first aspect-[4/5] overflow-hidden sm:order-none">
              <PublicPhoto slot="veteran" className="object-[20%_45%]" />
            </div>
          </section>
        </div>
      </section>

      <section
        id="comunidad"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.2em] text-mist uppercase">
            {t.kickers.about}
          </p>
          <h2 className="display mt-4 text-4xl text-bone sm:text-5xl">{t.about.pageTitle}</h2>
          <p className="mt-6 text-base leading-8 text-mist sm:text-lg">{t.about.lead}</p>
        </div>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {t.about.wants.map((item, index) => (
            <li key={item.title} className="border-t border-line pt-6">
              <span className="public-accent">{valueIcons[index]}</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-bone">{item.title}</h3>
              <p className="mt-2 text-base leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Apartado
          id="ofrecemos"
          kicker={t.home.offerKicker}
          title={t.home.offerTitle}
          lead={t.home.offerLead}
        >
          <ul className="mt-12 grid gap-10 sm:grid-cols-3">
            {t.home.offerItems.map((item) => (
              <li key={item.title} className="border-t border-line pt-6">
                <h3 className="text-lg font-semibold tracking-tight text-bone">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-mist">{item.body}</p>
              </li>
            ))}
          </ul>
        </Apartado>
      </div>

      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-medium tracking-[0.2em] text-mist uppercase">
            {t.kickers.spot}
          </p>
          <h2 className="display mt-4 max-w-xl text-4xl text-bone sm:text-5xl">{t.enter.fresh}</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-mist">{t.enter.freshLead}</p>
          <div className="mt-10">
            <JoinPanel locale={locale} t={t} session={session} featured />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <PublicFold id="codigo" title={t.nav.code} lead={t.enter.codeLead}>
          <ol className="divide-y divide-line border-y border-line">
            {t.code.map((item, index) => (
              <li key={item.title}>
                <details className="group/item py-5">
                    <summary className="cursor-pointer list-none marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-accent)]">
                    <span className="flex items-start justify-between gap-4">
                      <span>
                        <span className="text-[11px] tracking-[0.14em] text-mist">0{index + 1}</span>
                        <h3 className="mt-2 text-base font-semibold leading-6 text-bone">{item.title}</h3>
                      </span>
                      <span className="text-mist transition group-open/item:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">{item.body}</p>
                </details>
              </li>
            ))}
          </ol>
        </PublicFold>

        <PublicFold id="faq" title={t.nav.faq}>
          <Faq items={t.faq} />
        </PublicFold>
      </div>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[26rem]">
            <PublicPhoto slot="close" className="object-[center_55%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
            <p className="display absolute inset-x-6 bottom-8 max-w-xs text-3xl text-white sm:inset-x-10 sm:text-4xl">
              {t.footer.blurb
                .split(/(?<=\.)\s+/)
                .slice(0, 2)
                .map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
            </p>
          </div>
          <div className="flex flex-col justify-center bg-[var(--graphite)] px-6 py-16 text-asphalt sm:px-12 sm:py-20">
            <h2 className="display text-4xl sm:text-5xl">{t.home.closeTitle}</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-asphalt/75">{t.home.closeLead}</p>
            <div className="mt-8">{joinCta}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M8 8.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 14s4.2-3.4 4.2-6.6A4.2 4.2 0 0 0 8 3.2 4.2 4.2 0 0 0 3.8 7.4C3.8 10.6 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.8 16.8c.4-2.2 2.2-3.4 4.2-3.4s3.8 1.2 4.2 3.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16.2" cy="8.4" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15 13.6c1.7 0 3.2.9 3.7 2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M12 18s-6.2-3.7-6.2-7.2A3.3 3.3 0 0 1 12 8.4a3.3 3.3 0 0 1 6.2 2.4C18.2 14.3 12 18 12 18Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M6 16.5c6.5.6 10.8-3.6 11.2-10.2C10.6 6.7 6.4 11 6 16.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M9 14.2c1.8-1.6 3.8-2.6 6.2-3.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PeakIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="m4 17 5.2-8.2 3.1 4.8 2.2-3.4L20 17" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function RoadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M3 18h18" stroke="currentColor" strokeWidth="1.4" />
      <path d="m6.5 18 3.2-12h4.6l3.2 12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 8v2.2M12 13v2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function TreesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="m8.2 16-3-5h2.2L5.8 7.4h4.6L8.8 4.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.2 16v3.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="m16.4 16.2-3.2-5.2h2.3l-2.6-4h4.8l-1.7-2.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16.4 16.2V19.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="m13 3-7 10h5l-1 8 7-10h-5l1-8Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M7.5 4.5h6.2L18 8.8V19.5H7.5V4.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.6 4.5V8.8H18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M12 3.8 19 6.4v6.2c0 4.2-3 6.8-7 8.2-4-1.4-7-4-7-8.2V6.4L12 3.8Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
