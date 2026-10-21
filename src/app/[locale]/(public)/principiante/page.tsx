import type { Metadata } from "next";
import { AudienceLanding } from "@/components/audience-landing";
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
    path: "/principiante",
    title: t.beginner.metaTitle,
    description: t.beginner.metaDescription,
    absoluteTitle: true,
  });
}

export default async function PrincipiantePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const session = await getSession();

  return (
    <AudienceLanding
      locale={locale}
      t={t}
      session={session}
      path="/principiante"
      title={t.beginner.pageTitle}
      lead={t.beginner.lead}
      heading={t.beginner.heading}
      paragraphs={t.beginner.body}
      calloutKicker={t.beginner.seeks}
      points={t.beginner.points}
      cta={t.beginner.cta}
    />
  );
}
