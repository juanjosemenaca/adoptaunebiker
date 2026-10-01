import { AdminSoon } from "@/components/admin-soon";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AdminMeetupsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return (
    <AdminSoon
      kicker={t.admin.kicker}
      title={t.admin.meetupsTitle}
      lead={t.admin.meetupsLead}
      soon={t.admin.soon}
    />
  );
}
