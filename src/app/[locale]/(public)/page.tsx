import type { Metadata } from "next";
import { PublicLanding } from "@/components/public-landing";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { publicMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return publicMetadata({
    locale,
    title: t.meta.title,
    description: t.meta.description,
    absoluteTitle: true,
  });
}

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
