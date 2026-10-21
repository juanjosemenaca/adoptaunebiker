import Link from "next/link";
import { Faq } from "@/components/faq";
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

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-5">
      <PublicJsonLd
        locale={locale}
        url={localePath(isLocale(locale) ? locale : "es")}
        t={t}
        variant="home"
      />
      <section id="inicio" className="scroll-mt-28">
        <h1 className="display max-w-4xl text-[clamp(2.6rem,12vw,7rem)] text-bone">
          Adopta
          <br />
          un <span className="normal-case text-sodium">e</span>-biker
        </h1>
        {t.home.brandGloss ? (
          <p className="mt-3 pl-3 text-xl italic text-mist sm:pl-4 sm:text-2xl">
            ({t.home.brandGloss})
          </p>
        ) : null}
        <p className="display mt-10 max-w-3xl text-4xl leading-[0.95] text-bone sm:mt-12 sm:text-5xl">
          {t.home.line1}
          <br />
          {t.home.line2}
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{t.home.lead}</p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">{t.home.launchNote}</p>
        <p className="mt-8 max-w-3xl text-base leading-8 text-bone/90">{t.home.bridge}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {session ? (
            <Link
              href={links.intranet}
              className="inline-flex min-h-11 items-center justify-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
            >
              {t.home.ctaIn}
            </Link>
          ) : (
            <>
              <HashLink
                href={jump.join}
                eventName={analyticsEvents.signUpCtaClick}
                className="inline-flex min-h-11 items-center justify-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
              >
                {t.home.ctaOut}
              </HashLink>
              <HashLink
                href={jump.veteran}
                className="inline-flex min-h-11 items-center justify-center border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
              >
                {t.home.ctaGuide}
              </HashLink>
            </>
          )}
          <HashLink
            href={jump.how}
            className="inline-flex min-h-11 items-center justify-center border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
          >
            {t.home.how}
          </HashLink>
        </div>
      </section>

      <Apartado
        id="ofrecemos"
        kicker={t.home.offerKicker}
        title={t.home.offerTitle}
        lead={t.home.offerLead}
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {t.home.offerItems.map((item) => (
            <li key={item.title} className="border border-line bg-rubber p-5 sm:p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ul>
        <h3 className="display mt-12 text-3xl sm:text-4xl">{t.home.forWhomTitle}</h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {t.home.forWhom.map((item) => (
            <li key={item.title} className="border border-line bg-asphalt p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-sodium">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
            </li>
          ))}
        </ul>
      </Apartado>

      <Apartado
        id="comunidad"
        title={
          <>
            {t.about.title1}
            <br />
            {t.about.title2}
          </>
        }
        lead={t.about.lead}
      >
        <Subapartado>
          <h3 className="display text-2xl sm:text-3xl">{t.about.ideaTitle}</h3>
          <div className="mt-5 max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {t.about.idea.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>

        <Subapartado>
          <h3 className="display text-2xl sm:text-3xl">{t.about.wantTitle}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {t.about.wants.map((item) => (
              <li key={item.title} className="border border-line bg-rubber p-6">
                <h4 className="text-sm font-semibold uppercase tracking-[0.14em]">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
              </li>
            ))}
          </ul>
        </Subapartado>

        <Subapartado>
          <h3 className="display text-2xl sm:text-3xl">{t.about.bikeTitle}</h3>
          <div className="mt-5 max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {t.about.bike.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>

        <Subapartado>
          <h3 className="display text-2xl sm:text-3xl">{t.about.valuesTitle}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.values.map((item) => (
              <li key={item.title} className="border border-line bg-asphalt p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-sodium">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
              </li>
            ))}
          </ul>
        </Subapartado>

        <Subapartado>
          <div className="border border-line bg-rubber px-6 py-10 sm:px-10">
            <p className="text-[10px] uppercase tracking-[0.24em] text-sodium">
              {t.about.manifestoKicker}
            </p>
            <h3 className="display mt-4 max-w-3xl text-3xl sm:text-4xl">
              {t.about.manifestoTitle}
            </h3>
            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-mist">
              {t.about.manifesto.map((paragraph, index) => (
                <p key={paragraph.slice(0, 24)} className={index === 2 ? "text-bone" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <HashLink
              href={jump.join}
              eventName={analyticsEvents.signUpCtaClick}
              className="mt-8 inline-flex min-h-11 items-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
            >
              {t.about.join}
            </HashLink>
          </div>
        </Subapartado>
      </Apartado>

      <Apartado id="principiante" title={t.beginner.title} lead={t.beginner.lead}>
        <Subapartado>
          <h3 className="display text-2xl sm:text-3xl">{t.beginner.heading}</h3>
          <div className="mt-5 max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {t.beginner.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>
        <Subapartado>
          <PlazaCallout
            kicker={t.beginner.seeks}
            points={t.beginner.points}
            href={jump.join}
            cta={t.beginner.cta}
          />
        </Subapartado>
      </Apartado>

      <Apartado id="veterano" title={t.veteran.title} lead={t.veteran.lead}>
        <Subapartado>
          <h3 className="display text-2xl sm:text-3xl">{t.veteran.heading}</h3>
          <div className="mt-5 max-w-3xl space-y-5 text-base leading-8 text-bone/90">
            {t.veteran.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Subapartado>
        <Subapartado>
          <PlazaCallout
            kicker={t.veteran.gives}
            points={t.veteran.points}
            href={jump.join}
            cta={t.veteran.cta}
          />
        </Subapartado>
      </Apartado>

      <Apartado
        kicker={t.home.matchKicker}
        title={t.home.matchTitle}
      >
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

      <Apartado
        id="entrar"
        title={
          <>
            {t.enter.title1}
            <br />
            {t.enter.title2}
          </>
        }
        lead={t.enter.lead}
      >
        <Subapartado>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((step, index) => (
              <li key={step.title} className="border border-line bg-rubber p-5">
                <p className="display text-3xl text-sodium">0{index + 1}</p>
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-mist">{step.body}</p>
              </li>
            ))}
          </ol>
        </Subapartado>

        <Subapartado>
          <JoinPanel locale={locale} t={t} session={session} />
        </Subapartado>
      </Apartado>

      <Apartado id="codigo" title={t.nav.code} lead={t.enter.codeLead}>
        <Subapartado>
          <ol className="grid gap-4 sm:grid-cols-2">
            {t.code.map((item, index) => (
              <li key={item.title} className="border border-line bg-asphalt p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-sodium">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-6">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-mist">{item.body}</p>
              </li>
            ))}
          </ol>
        </Subapartado>
      </Apartado>

      <Apartado id="faq" title={t.nav.faq}>
        <Subapartado>
          <Faq items={t.faq} />
        </Subapartado>
      </Apartado>

      <Apartado title={t.home.closeTitle} lead={t.home.closeLead}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              {t.home.ctaOut}
            </HashLink>
          )}
        </div>
      </Apartado>
    </div>
  );
}
