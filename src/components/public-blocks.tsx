import type { ReactNode } from "react";
import { HashLink } from "@/components/hash-link";
import { PublicCtaIcon } from "@/components/public-cta-icon";
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
    <section id={id} className="scroll-mt-28 py-16 sm:py-20">
      {kicker ? (
        <p className="mb-4 text-[11px] font-medium tracking-[0.16em] text-mist uppercase">
          {kicker}
        </p>
      ) : null}
      <h2 className="display max-w-4xl text-3xl text-bone sm:text-[2.75rem]">{title}</h2>
      {lead ? <p className="mt-5 max-w-2xl text-base leading-8 text-mist sm:text-lg">{lead}</p> : null}
      {children ?? null}
    </section>
  );
}

export function Subapartado({ children }: { children: ReactNode }) {
  return <div className="mt-10 sm:mt-12">{children}</div>;
}

export function PlazaCallout({
  kicker,
  points,
  href,
  cta,
  className,
}: {
  kicker: string;
  points: readonly string[];
  href: string;
  cta: string;
  className?: string;
}) {
  return (
    <div className={`flex h-full max-w-none flex-col ${className ?? ""}`}>
      <p className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase">{kicker}</p>
      <ul className="mt-5 flex-1 space-y-3 text-sm leading-7 text-mist">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <HashLink
        href={href}
        eventName={analyticsEvents.signUpCtaClick}
        className="public-cta mt-8 self-start"
      >
        {cta}
        <PublicCtaIcon />
      </HashLink>
    </div>
  );
}
