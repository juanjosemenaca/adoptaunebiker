import type { Metadata } from "next";
import Link from "next/link";
import { AdminInboxComposeForm } from "@/components/admin-inbox-compose-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { listMembers } from "@/lib/members";
import { hrefs } from "@/lib/paths";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).admin.inboxNew, robots: { index: false, follow: false } };
}

export default async function AdminInboxNewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ miembro?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const members = (await listMembers())
    .map((member) => ({
      id: member.id,
      name: [member.name, member.lastName].filter(Boolean).join(" ") || member.slug,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  const defaultMemberId =
    query.miembro && members.some((member) => member.id === query.miembro) ? query.miembro : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl">{t.admin.inboxNew}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.inboxLead}</p>
      <Link
        href={links.adminInbox}
        className="mt-6 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
      >
        {t.intranet.inbox.back}
      </Link>
      {members.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.membersEmpty}</p>
      ) : (
        <AdminInboxComposeForm locale={locale} t={t} members={members} defaultMemberId={defaultMemberId} />
      )}
    </div>
  );
}
