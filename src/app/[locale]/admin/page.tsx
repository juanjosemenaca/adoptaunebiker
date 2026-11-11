import Link from "next/link";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";
import { countAdminInboxUnread } from "@/lib/admin-inbox";
import { countOpenRides } from "@/lib/rides";
import { countCommunityProfiles } from "@/lib/session";
import { countUnreadSignupRequests } from "@/lib/signup-requests";

export default async function AdminPanelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const [unread, inboxUnread, communityCount, rideCount] = await Promise.all([
    countUnreadSignupRequests(),
    countAdminInboxUnread(),
    countCommunityProfiles(),
    countOpenRides(),
  ]);

  const cards = [
    {
      href: links.adminRequests,
      label: t.nav.requests,
      count: unread,
      lead: t.admin.lead,
    },
    {
      href: links.adminInbox,
      label: t.nav.adminInbox,
      count: inboxUnread,
      lead: t.admin.inboxLead,
    },
    {
      href: links.adminMembers,
      label: t.nav.members,
      count: communityCount,
      lead: t.admin.membersLead,
    },
    {
      href: links.adminMeetups,
      label: t.nav.meetups,
      count: rideCount,
      lead: t.admin.meetupsLead,
    },
    {
      href: links.adminBlog,
      label: t.nav.blog,
      count: null,
      lead: t.admin.blogLead,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.panelTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.panelLead}</p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="flex h-full flex-col border border-line bg-rubber p-5 transition-colors hover:border-sodium"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-mist">{card.label}</p>
              {card.count !== null ? <p className="display mt-3 text-5xl">{card.count}</p> : null}
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
