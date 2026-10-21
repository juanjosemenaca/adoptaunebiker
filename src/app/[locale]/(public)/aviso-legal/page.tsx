import { LegalScreen, legalPageMetadata } from "@/components/legal-screen";

export const generateMetadata = legalPageMetadata("notice");

export default async function AvisoLegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalScreen locale={locale} kind="notice" />;
}
