import { LegalScreen, legalPageMetadata } from "@/components/legal-screen";
import { getDictionary } from "@/i18n/get-dictionary";
import { safeJoinFormReturn } from "@/lib/paths";

export const generateMetadata = legalPageMetadata("privacy");

export default async function PrivacidadPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ desde?: string; volver?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const fromJoin = query.desde === "alta";
  const t = getDictionary(locale);
  return (
    <LegalScreen
      locale={locale}
      kind="privacy"
      backHref={fromJoin ? safeJoinFormReturn(locale, query.volver) : undefined}
      backLabel={fromJoin ? t.legal.nav.backForm : undefined}
    />
  );
}
