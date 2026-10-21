import type { ReactNode } from "react";
import { HashLink } from "@/components/hash-link";
import { analyticsEvents } from "@/lib/analytics";

export function Apartado({
  id,
  kicker,
  title,
  lead,
  children,
}: {
  id?: string;
  kicker?: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="mt-24 scroll-mt-28 border-t-2 border-bone/25 pt-8 sm:mt-28 sm:pt-10">
      {kicker ? (
        <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-sodium">{kicker}</p>
      ) : null}
      <h2 className="display max-w-4xl text-5xl text-bone sm:text-7xl">{title}</h2>
      {lead ? <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{lead}</p> : null}
      {children ?? null}
    </section>
  );
}

export function Subapartado({ children }: { children: ReactNode }) {
  return (
    <div className="mt-12 border-l-2 border-sodium/45 pl-5 sm:mt-14 sm:pl-8">{children}</div>
  );
}

export function PlazaCallout({
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
        eventName={analyticsEvents.signUpCtaClick}
        className="mt-8 inline-flex min-h-11 self-start items-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
      >
        {cta}
      </HashLink>
    </div>
  );
}
