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
    path: "/veterano",
    title: t.veteran.metaTitle,
    description: t.veteran.metaDescription,
    absoluteTitle: true,
  });
}

export default async function VeteranoPage({
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
      path="/veterano"
      title={t.veteran.pageTitle}
      lead={t.veteran.lead}
      heading={t.veteran.heading}
      paragraphs={t.veteran.body}
      calloutKicker={t.veteran.gives}
      points={t.veteran.points}
      cta={t.veteran.cta}
    />
  );
}
