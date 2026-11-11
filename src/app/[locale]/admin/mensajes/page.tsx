import type { Metadata } from "next";
import Link from "next/link";
import { dateLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { listAdminInbox, threadIsUnread } from "@/lib/admin-inbox";
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
  const threads = await listAdminInbox();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.inboxTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.inboxLead}</p>

      {threads.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.inboxEmpty}</p>
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
                      {thread.memberName || t.intranet.cyclist} · {t.intranet.inbox.kinds[thread.kind]}
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
