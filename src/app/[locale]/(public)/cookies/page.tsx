import { LegalScreen, legalPageMetadata } from "@/components/legal-screen";

export const generateMetadata = legalPageMetadata("cookies");

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalScreen locale={locale} kind="cookies" />;
}
