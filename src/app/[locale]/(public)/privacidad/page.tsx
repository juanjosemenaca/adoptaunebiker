import { LegalScreen, legalPageMetadata } from "@/components/legal-screen";

export const generateMetadata = legalPageMetadata("privacy");

export default async function PrivacidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalScreen locale={locale} kind="privacy" />;
}
