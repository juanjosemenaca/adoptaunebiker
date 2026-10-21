import { LegalScreen, legalPageMetadata } from "@/components/legal-screen";

export const generateMetadata = legalPageMetadata("terms");

export default async function CondicionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalScreen locale={locale} kind="terms" />;
}
