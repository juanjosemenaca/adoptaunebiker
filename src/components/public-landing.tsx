import type { ReactNode } from "react";
import Link from "next/link";
import { Faq } from "@/components/faq";
import { HashLink } from "@/components/hash-link";
import { JoinForm } from "@/components/join-form";
import { logoutCommunity } from "@/app/actions";
import { anchors, hrefs } from "@/lib/paths";
import type { Dictionary } from "@/i18n/types";
import type { SessionUser } from "@/lib/types";

function Apartado({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: ReactNode;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-24 scroll-mt-28 border-t-2 border-bone/25 pt-8 sm:mt-28 sm:pt-10">
      <h2 className="display max-w-4xl text-5xl text-bone sm:text-7xl">{title}</h2>
      {lead ? <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{lead}</p> : null}
      {children}
    </section>
  );
}

function Subapartado({ children }: { children: ReactNode }) {
  return (
    <div className="mt-12 border-l-2 border-sodium/45 pl-5 sm:mt-14 sm:pl-8">{children}</div>
  );
}

function PlazaCallout({
  kicker,
  points,
  href,
  cta,
}: {
  kicker: string;
  points: readonly string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="flex max-w-xl flex-col border border-line bg-rubber p-6 sm:p-8">
      <p className="text-[10px] uppercase tracking-[0.22em] text-sodium">{kicker}</p>
      <ul className="mt-5 flex-1 space-y-4 text-sm leading-7 text-mist">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <HashLink
        href={href}
        className="mt-8 inline-flex self-start bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
      >
        {cta}
      </HashLink>
    </div>
  );
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

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-5">
      <section id="inicio" className="scroll-mt-28">
        <h1 className="display max-w-4xl text-[16vw] text-bone sm:text-[7rem]">
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
        <p className="mt-10 max-w-3xl text-base leading-8 text-bone/90">{t.home.bridge}</p>
      </section>

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
            <Link
              href={jump.how}
              className="mt-8 inline-flex bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
            >
              {t.about.join}
            </Link>
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

        {session ? (
          <Subapartado>
            <div id="crear-plaza" className="max-w-xl scroll-mt-28 border border-volt bg-rubber p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-volt">
                {t.enter.inside}
              </p>
              <h3 className="display mt-3 text-4xl">{session.name}</h3>
              <p className="mt-3 text-mist">
                {session.role === "mentor" ? t.roles.mentor : t.roles.beginner} ·{" "}
                {t.disciplines[session.discipline]} · {session.city}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={links.intranet}
                  className="bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
                >
                  {t.enter.goIntranet}
                </Link>
                <form action={logoutCommunity}>
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="border border-line px-5 py-3 text-xs uppercase tracking-[0.2em] text-mist"
                  >
                    {t.enter.logout}
                  </button>
                </form>
              </div>
            </div>
          </Subapartado>
        ) : (
          <Subapartado>
            <div id="crear-plaza" className="scroll-mt-28">
              <h3 className="display text-2xl sm:text-3xl">{t.enter.fresh}</h3>
              <p className="mt-3 mb-6 max-w-xl text-sm text-mist">{t.enter.freshLead}</p>
              <JoinForm locale={locale} t={t} />
            </div>
          </Subapartado>
        )}
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
    </div>
  );
}
