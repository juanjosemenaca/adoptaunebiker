import Link from "next/link";
import { JoinForm } from "@/components/join-form";
import { hrefs } from "@/lib/paths";
import type { Dictionary } from "@/i18n/types";

export function JoinPanel({
  locale,
  t,
  heading,
  lead,
  featured = false,
}: {
  locale: string;
  t: Dictionary;
  heading?: string;
  lead?: string;
  featured?: boolean;
}) {
  const links = hrefs(locale);

  return (
    <div id="crear-plaza" className="scroll-mt-28">
      {featured ? null : (
        <>
          <h3 className="display text-2xl sm:text-3xl">{heading ?? t.enter.fresh}</h3>
          <p className="mt-3 mb-6 max-w-xl text-sm text-mist">{lead ?? t.enter.freshLead}</p>
        </>
      )}
      <JoinForm locale={locale} t={{ forms: t.forms, disciplines: t.disciplines }} />
      <p className="mt-6 text-sm leading-6 text-mist">
        <Link href={links.entrar} className="text-bone underline underline-offset-4 hover:text-sodium">
          {t.enter.have}
        </Link>
        {` · ${t.enter.haveLead}`}
      </p>
    </div>
  );
}
