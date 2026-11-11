import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dateLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { listInboxForMember, threadIsUnread } from "@/lib/admin-inbox";
import { getMemberById } from "@/lib/members";
import { hrefs } from "@/lib/paths";
import { rideStamp } from "@/lib/ride-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).admin.inboxHistory, robots: { index: false, follow: false } };
}

export default async function AdminInboxMemberPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  const member = await getMemberById(id);
  if (!member) notFound();
  const name = [member.name, member.lastName].filter(Boolean).join(" ") || member.slug;
  const threads = await listInboxForMember(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.inboxHistory}</p>
      <h1 className="display mt-3 text-6xl">{name}</h1>
      <p className="mt-4 max-w-xl text-mist">{fill(t.admin.inboxHistoryLead, { name })}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={links.adminInbox}
          className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
        >
          {t.intranet.inbox.back}
        </Link>
        <Link
          href={`${links.adminInboxNew}?miembro=${member.id}`}
          className="inline-flex min-h-11 items-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        >
          {t.admin.inboxNew}
        </Link>
        <Link
          href={links.adminMember(member.id)}
          className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-mist hover:text-bone"
        >
          {t.admin.memberOpen}
        </Link>
      </div>

      {threads.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.inboxThreadsEmpty}</p>
      ) : (
        <ul className="mt-12 divide-y divide-line border border-line">
          {threads.map((thread) => {
            const unread = threadIsUnread(thread, true);
            return (
              <li key={thread.id}>
                <Link
                  href={links.adminInboxThread(thread.id)}
                  className="flex flex-col gap-1 bg-rubber px-4 py-4 hover:bg-panel sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      {unread ? <span className="h-2 w-2 rounded-full bg-clay" /> : null}
                      <span className="text-sm text-bone">{thread.subject}</span>
                    </span>
                    <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-mist">
                      {t.intranet.inbox.kinds[thread.kind]}
                      {thread.status === "closed" ? ` · ${t.intranet.inbox.closed}` : ""}
                    </span>
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-mist">
                    {unread ? `${t.admin.inboxUnread} · ` : ""}
                    {rideStamp(thread.updatedAt, lang)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
