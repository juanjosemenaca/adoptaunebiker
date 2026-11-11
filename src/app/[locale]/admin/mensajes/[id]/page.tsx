import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteAdminInboxThreadAction, setInboxThreadStatusAction } from "@/app/inbox-actions";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { InboxReplyForm } from "@/components/inbox-reply-form";
import { dateLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { canReplyToThread, getInboxThread, listInboxMessages, markInboxThreadRead } from "@/lib/admin-inbox";
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

export default async function AdminInboxThreadPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  await markInboxThreadRead(id);
  const thread = await getInboxThread(id);
  if (!thread) notFound();
  const messages = await listInboxMessages(id, t.intranet.inbox.fromAdmin);
  const canReply = canReplyToThread(thread.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.intranet.inbox.kinds[thread.kind]}</p>
      <h1 className="display mt-3 text-6xl">{thread.subject}</h1>
      <p className="mt-4 text-mist">
        {thread.memberName || t.intranet.cyclist}
        {thread.status === "closed" ? ` · ${t.intranet.inbox.closed}` : ""}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href={links.adminInboxMember(thread.memberId)}
          className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
        >
          {t.admin.inboxHistory}
        </Link>
        <Link
          href={links.adminInbox}
          className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-mist hover:text-bone"
        >
          {t.intranet.inbox.back}
        </Link>
        <Link
          href={links.adminMember(thread.memberId)}
          className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-mist hover:text-bone"
        >
          {t.admin.memberOpen}
        </Link>
      </div>

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

      {canReply ? <InboxReplyForm threadId={thread.id} locale={locale} t={t} /> : (
        <p className="mt-8 text-sm text-mist">{t.intranet.inbox.closedHint}</p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <form action={setInboxThreadStatusAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="threadId" value={thread.id} />
          <input type="hidden" name="status" value={canReply ? "closed" : "open"} />
          <button type="submit" className="text-xs uppercase tracking-[0.16em] text-mist hover:text-bone">
            {canReply ? t.admin.inboxClose : t.admin.inboxReopen}
          </button>
        </form>
        <form action={deleteAdminInboxThreadAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="threadId" value={thread.id} />
          <input type="hidden" name="memberId" value={thread.memberId} />
          <ConfirmSubmit
            message={t.admin.inboxDeleteConfirm}
            again={t.admin.inboxDeleteConfirmAgain}
            className="text-xs uppercase tracking-[0.16em] text-mist hover:text-bone"
          >
            {t.admin.inboxDelete}
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}
