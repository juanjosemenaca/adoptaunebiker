import { MembersTable, type MemberTableRow } from "@/components/members-table";
import { getDictionary } from "@/i18n/get-dictionary";
import { listMembers, memberStamp } from "@/lib/members";
import { hrefs } from "@/lib/paths";
import { interestedLabel, practiceListLabel } from "@/lib/signup-meta";

export default async function AdminMembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const members = await listMembers();

  const rows: MemberTableRow[] = members.map((member) => ({
    id: member.id,
    href: links.adminMember(member.id),
    name: member.name,
    lastName: member.lastName,
    email: member.email,
    city: member.city,
    country: member.country,
    veteran: practiceListLabel(t, member.veteranIn),
    beginner: practiceListLabel(t, member.beginnerIn),
    interested: interestedLabel(t, member.interestedIn),
    status: member.memberStatus,
    statusLabel:
      member.memberStatus === "inactive"
        ? t.admin.memberStatusInactive
        : t.admin.memberStatusActive,
    createdAt: member.createdAt,
    createdLabel: member.createdAt ? memberStamp(member.createdAt) : "",
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.membersTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.membersLead}</p>

      {members.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.membersEmpty}</p>
      ) : (
        <MembersTable members={rows} locale={locale} t={t} />
      )}
    </div>
  );
}
