import type { Metadata } from "next";
import Link from "next/link";
import { dateLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { groupInboxByMember, listAdminInbox } from "@/lib/admin-inbox";
import { hrefs } from "@/lib/paths";
import { rideStamp } from "@/lib/ride-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).admin.inboxTitle, robots: { index: false, follow: false } };
}

export default async function AdminInboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  const folders = groupInboxByMember(await listAdminInbox());

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.inboxTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.inboxLead}</p>
      <Link href={links.adminInboxNew} className="mt-8 inline-flex min-h-11 items-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone">
        {t.admin.inboxNew}
      </Link>

      {folders.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.inboxPeopleEmpty}</p>
      ) : (
        <ul className="mt-12 divide-y divide-line border border-line">
          {folders.map((folder) => (
            <li key={folder.memberId}>
              <Link
                href={links.adminInboxMember(folder.memberId)}
                className="flex flex-col gap-1 bg-rubber px-4 py-4 hover:bg-panel sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    {folder.unread > 0 ? <span className="h-2 w-2 rounded-full bg-clay" /> : null}
                    <span className="text-sm text-bone">{folder.memberName || t.intranet.cyclist}</span>
                  </span>
                  <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-mist">
                    {fill(t.admin.inboxFolderCount, { n: folder.threadCount })}
                    {folder.unread > 0 ? ` · ${t.admin.inboxUnread}` : ""}
                  </span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-mist">
                  {rideStamp(folder.updatedAt, lang)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
