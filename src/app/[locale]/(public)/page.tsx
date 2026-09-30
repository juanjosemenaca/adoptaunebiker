import { PublicLanding } from "@/components/public-landing";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSession } from "@/lib/session";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const session = await getSession();

  return <PublicLanding locale={locale} t={t} session={session} />;
}
