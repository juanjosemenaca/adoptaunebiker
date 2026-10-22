import Link from "next/link";
import { logoutCommunity } from "@/app/actions";
import { JoinForm } from "@/components/join-form";
import { hrefs } from "@/lib/paths";
import type { Dictionary } from "@/i18n/types";
import type { SessionUser } from "@/lib/types";

export function JoinPanel({
  locale,
  t,
  session,
  heading,
  lead,
  featured = false,
}: {
  locale: string;
  t: Dictionary;
  session: SessionUser | null;
  heading?: string;
  lead?: string;
  featured?: boolean;
}) {
  const links = hrefs(locale);

  if (session) {
    return (
      <div id="crear-plaza" className={`scroll-mt-28 ${featured ? "bg-rubber p-6 sm:p-10" : "max-w-xl py-2"}`}>
        <p className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase">{t.enter.inside}</p>
        <h3 className="display mt-3 text-4xl">{session.name}</h3>
        <p className="mt-3 text-mist">
          {session.role === "mentor" ? t.roles.mentor : t.roles.beginner} ·{" "}
          {t.disciplines[session.discipline]} · {session.city}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={links.intranet} className="public-cta">
            {t.enter.goIntranet}
          </Link>
          <form action={logoutCommunity}>
            <input type="hidden" name="locale" value={locale} />
            <button type="submit" className="text-sm text-mist hover:text-bone">
              {t.enter.logout}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="crear-plaza" className="scroll-mt-28">
      {featured ? null : (
        <>
          <h3 className="display text-2xl sm:text-3xl">{heading ?? t.enter.fresh}</h3>
          <p className="mt-3 mb-6 max-w-xl text-sm text-mist">{lead ?? t.enter.freshLead}</p>
        </>
      )}
      <JoinForm locale={locale} t={{ forms: t.forms, disciplines: t.disciplines }} />
    </div>
  );
}
