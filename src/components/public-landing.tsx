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

const heroPointIcons = [
  <ChatIcon key="chat" />,
  <TrailIcon key="trail" />,
  <GroupIcon key="group" />,
];

type DisciplineKind = "road" | "gravel" | "mtb" | "electric";

const disciplineLook: Record<
  DisciplineKind,
  { slot: "road" | "gravel" | "mtb" | "electric"; radius: string; photoClass: string }
> = {
  road: {
    slot: "road",
    radius: "3.4rem 5.6rem 2.6rem 4.8rem / 3.8rem 2.8rem 4.6rem 3.2rem",
    photoClass: "object-[74%_center]",
  },
  gravel: {
    slot: "gravel",
    radius: "5.2rem 3.1rem 5.4rem 2.7rem / 3.2rem 5rem 2.6rem 4.8rem",
    photoClass: "object-[82%_center]",
  },
  mtb: {
    slot: "mtb",
    radius: "3rem 4.9rem 2.4rem 5.5rem / 4.4rem 2.9rem 4.8rem 3rem",
    photoClass: "object-[80%_center]",
  },
  electric: {
    slot: "electric",
    radius: "2.6rem 5.8rem 3.5rem 2.9rem / 3.1rem 5.2rem 2.5rem 4.4rem",
    photoClass: "object-[90%_center]",
  },
};

function disciplineKind(tag: string): DisciplineKind {
  const key = tag.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (key.includes("gravel")) return "gravel";
  if (key.includes("mtb") || key.includes("vtt")) return "mtb";
  if (key.includes("electr")) return "electric";
  return "road";
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
  const heroCta = (
    <HashLink
      href={jump.join}
      eventName={analyticsEvents.signUpCtaClick}
      className="public-cta uppercase tracking-[0.04em]"
    >
      {t.home.ctaHero}
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

      <section id="inicio" className="relative scroll-mt-28">
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-16 sm:px-8 lg:pt-14 lg:pb-20">
          <h1 className="display text-center text-[clamp(2.25rem,4.8vw,3.7rem)] leading-[1.15] font-bold text-bone">
            {t.home.line1} {t.home.line2}
            <br />
            <span className="public-accent border-b-[3px] border-current pb-1">
              {t.home.line3}
            </span>
          </h1>

          <div className="mx-auto mt-14 max-w-3xl space-y-5 text-center text-[1.2rem] leading-8 text-bone/80 sm:text-[1.28rem] sm:leading-9">
            <p>{t.home.lead.question}</p>
            <p>{t.home.lead.watts}</p>
            <p>{t.home.lead.start}</p>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
            {t.home.lead.points.map((point, index) => (
              <li
                key={point.title}
                className={`flex flex-col items-center gap-3 text-center md:px-8 ${
                  index > 0 ? "md:border-l md:border-black/10" : ""
                }`}
              >
                <span className="public-accent shrink-0">{heroPointIcons[index]}</span>
                <div>
                  <p className="whitespace-pre-line text-[1.15rem] font-semibold leading-[1.25] text-bone">
                    {point.title}
                  </p>
                  <p className="mx-auto mt-2 max-w-[13.5rem] text-[0.9rem] leading-6 text-mist">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-12 max-w-3xl text-center text-[1.2rem] leading-8 text-bone/80 sm:text-[1.28rem] sm:leading-9">
            {t.home.lead.after}
          </p>
          <p className="display mt-12 text-center text-[clamp(1.25rem,2.4vw,1.7rem)] font-bold tracking-[-0.02em] text-bone">
            {t.home.lead.close}{" "}
            <span className="public-accent border-b-[3px] border-current pb-0.5">
              {t.home.lead.closeAccent}
            </span>
          </p>
          <div className="mt-14 flex justify-center">{heroCta}</div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-3">
          {t.home.welcomeTags.map((tag) => {
            const kind = disciplineKind(tag);
            const look = disciplineLook[kind];

            return (
              <li
                key={tag}
                className="relative aspect-[5/3] overflow-hidden"
                style={{ borderRadius: look.radius }}
              >
                <PublicPhoto
                  slot={look.slot}
                  alt=""
                  className={look.photoClass}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f5f5f0] from-0% via-[#f5f5f0]/92 via-16% to-transparent to-40%" />
                <span className="absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center sm:w-12">
                  <span
                    className={`-rotate-90 whitespace-nowrap font-bold tracking-tight text-bone ${
                      tag.length > 14 ? "text-[0.8rem] sm:text-sm" : "text-base sm:text-lg"
                    }`}
                  >
                    {tag}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="entrar" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium tracking-[0.2em] text-mist uppercase">{t.nav.how}</p>
        <h2 className="display mt-4 max-w-lg text-4xl text-bone sm:text-5xl">{t.home.howTitle}</h2>
        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-0">
          {t.home.matchItems.map((item, index) => (
            <li key={item.title} className="relative md:px-8 md:first:pl-0 md:last:pr-0">
              {index < 2 ? (
                <span
                  className="pointer-events-none absolute top-7 left-16 right-0 hidden h-px bg-line md:block"
                  aria-hidden
                />
              ) : null}
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-[var(--public-mark)] text-lg font-bold text-[var(--graphite)]">
                {index + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-bone">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <section
            id="principiante"
            className="grid scroll-mt-28 items-center gap-8 bg-rubber px-4 py-16 sm:grid-cols-[0.85fr_1.15fr] sm:px-6 sm:py-20"
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
            </div>
            <div className="relative order-first aspect-[4/5] overflow-hidden sm:order-none">
              <PublicPhoto slot="veteran" className="object-[20%_45%]" />
            </div>
          </section>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Apartado
          id="funcionamos"
          kicker={t.home.operateKicker}
          title={t.home.operateTitle}
          lead={t.home.operateLead}
        >
          <ul className="mt-12 grid gap-10 sm:grid-cols-3">
            {t.home.operateItems.map((item) => (
              <li key={item.title} className="border-t border-line pt-6">
                <h3 className="text-lg font-semibold tracking-tight text-bone">{item.title}</h3>
                {item.quote ? (
                  <p className="mt-3 text-base leading-7 text-mist italic">«{item.quote}»</p>
                ) : null}
                <p className="mt-3 text-base leading-7 text-mist">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-center text-[1.2rem] font-semibold leading-8 text-bone sm:text-[1.28rem]">
            {t.home.operateClose}
          </p>
        </Apartado>

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

      <section className="bg-panel">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-medium tracking-[0.2em] text-mist uppercase">
            {t.kickers.spot}
          </p>
          <h2 className="display mt-4 max-w-xl text-4xl text-bone sm:text-5xl">{t.enter.fresh}</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-mist">{t.enter.freshLead}</p>
          <div className="mt-10">
            <JoinPanel locale={locale} t={t} featured />
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

      <section>
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

function ChatIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-11 w-11" fill="none" aria-hidden>
      <path
        d="M6.5 8.2c0-1.5 1.2-2.7 2.7-2.7h13.6c1.5 0 2.7 1.2 2.7 2.7v9.4c0 1.5-1.2 2.7-2.7 2.7h-5.4l-5.2 3.8v-3.8H9.2c-1.5 0-2.7-1.2-2.7-2.7V8.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M11 13h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TrailIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-11 w-11" fill="none" aria-hidden>
      <path
        d="M5 23.5 16 7.5 27 23.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 23.5c5.5-8 12-8.4 18.5 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-11 w-11" fill="none" aria-hidden>
      <circle cx="16" cy="9.2" r="3.1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.6 24.2c.7-3.6 3.6-5.4 7.4-5.4s6.7 1.8 7.4 5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="7.4" cy="11.2" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.6 23.2c.4-2.3 2-3.5 4.2-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="24.6" cy="11.2" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M28.4 23.2c-.4-2.3-2-3.5-4.2-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

