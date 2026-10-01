import { AdminSoon } from "@/components/admin-soon";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AdminMembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return (
    <AdminSoon
      kicker={t.admin.kicker}
      title={t.admin.membersTitle}
      lead={t.admin.membersLead}
      soon={t.admin.soon}
    />
  );
}
