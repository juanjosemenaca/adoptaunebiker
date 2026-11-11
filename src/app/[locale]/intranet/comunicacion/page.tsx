import type { Metadata } from "next";
import Link from "next/link";
import { InboxComposeForm } from "@/components/inbox-compose-form";
import { dateLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { listMemberInbox, threadIsUnread } from "@/lib/admin-inbox";
import { hrefs } from "@/lib/paths";
import { rideStamp } from "@/lib/ride-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).intranet.inbox.title, robots: { index: false, follow: false } };
}

export default async function InboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  const threads = await listMemberInbox();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.intranet.inbox.title}</p>
      <h1 className="display mt-3 text-6xl">{t.intranet.inbox.title}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.intranet.inbox.lead}</p>

      <InboxComposeForm locale={locale} t={t} />

      {threads.length === 0 ? (
        <p className="mt-12 text-mist">{t.intranet.inbox.empty}</p>
      ) : (
        <ul className="mt-12 divide-y divide-line border border-line">
          {threads.map((thread) => {
            const unread = threadIsUnread(thread, false);
            return (
              <li key={thread.id}>
                <Link
                  href={links.inboxThread(thread.id)}
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
