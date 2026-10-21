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
}: {
  locale: string;
  t: Dictionary;
  session: SessionUser | null;
  heading?: string;
  lead?: string;
}) {
  const links = hrefs(locale);

  if (session) {
    return (
      <div id="crear-plaza" className="max-w-xl scroll-mt-28 border border-volt bg-rubber p-6">
        <p className="text-[11px] uppercase tracking-[0.24em] text-volt">{t.enter.inside}</p>
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
    );
  }

  return (
    <div id="crear-plaza" className="scroll-mt-28">
      <h3 className="display text-2xl sm:text-3xl">{heading ?? t.enter.fresh}</h3>
      <p className="mt-3 mb-6 max-w-xl text-sm text-mist">{lead ?? t.enter.freshLead}</p>
      <JoinForm locale={locale} t={{ forms: t.forms, disciplines: t.disciplines }} />
    </div>
  );
}
