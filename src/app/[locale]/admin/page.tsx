import Link from "next/link";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";
import { listRiders } from "@/lib/session";
import { listSignupRequests } from "@/lib/signup-requests";

export default async function AdminPanelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const [requests, riders] = await Promise.all([listSignupRequests(), listRiders()]);

  const cards = [
    {
      href: links.adminRequests,
      label: t.nav.requests,
      count: requests.length,
      lead: t.admin.lead,
    },
    {
      href: links.adminMembers,
      label: t.nav.members,
      count: riders.length,
      lead: t.admin.membersLead,
    },
    {
      href: links.adminMeetups,
      label: t.nav.meetups,
      count: 0,
      lead: t.admin.meetupsLead,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.panelTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.panelLead}</p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="flex h-full flex-col border border-line bg-rubber p-5 transition-colors hover:border-sodium"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-mist">{card.label}</p>
              <p className="display mt-3 text-5xl">{card.count}</p>
              <p className="mt-3 flex-1 text-sm leading-6 text-mist">{card.lead}</p>
              <span className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-sodium">
                {t.admin.open}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
