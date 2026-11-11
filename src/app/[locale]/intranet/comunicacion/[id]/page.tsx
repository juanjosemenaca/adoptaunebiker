import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InboxReplyForm } from "@/components/inbox-reply-form";
import { dateLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { canReplyToThread, getInboxThread, listInboxMessages, markInboxThreadRead } from "@/lib/admin-inbox";
import { hrefs } from "@/lib/paths";
import { rideStamp } from "@/lib/ride-helpers";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).intranet.inbox.title, robots: { index: false, follow: false } };
}

export default async function InboxThreadPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  await markInboxThreadRead(id);
  const thread = await getInboxThread(id);
  if (!thread || thread.memberId !== session.id) notFound();
  const messages = await listInboxMessages(id, t.intranet.inbox.fromAdmin);
  const canReply = canReplyToThread(thread.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.intranet.inbox.kinds[thread.kind]}</p>
      <h1 className="display mt-3 text-6xl">{thread.subject}</h1>
      <p className="mt-4 text-mist">
        {thread.status === "closed" ? t.intranet.inbox.closed : t.intranet.inbox.threadLead}
      </p>
      <Link
        href={links.inbox}
        className="mt-6 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
      >
        {t.intranet.inbox.back}
      </Link>

      <ul className="mt-10 space-y-3">
        {messages.map((message) => (
          <li key={message.id} className="border border-line bg-rubber p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-mist">
              {message.authorName} · {rideStamp(message.createdAt, lang)}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-bone">{message.body}</p>
          </li>
        ))}
      </ul>

      {canReply ? (
        <InboxReplyForm threadId={thread.id} locale={locale} t={t} />
      ) : (
        <p className="mt-8 text-sm text-mist">{t.intranet.inbox.closedHint}</p>
      )}
    </div>
  );
}
