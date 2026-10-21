import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { PublicJsonLd } from "@/components/public-json-ld";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";
import { publicMetadata } from "@/lib/seo";
import { localePath } from "@/lib/site";

export type LegalKind = "notice" | "privacy" | "cookies" | "terms";

export const legalPathByKind: Record<LegalKind, string> = {
  notice: "/aviso-legal",
  privacy: "/privacidad",
  cookies: "/cookies",
  terms: "/condiciones-de-uso",
};

export function legalPageMetadata(kind: LegalKind) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    const t = getDictionary(locale);
    const doc = t.legal[kind];
    return publicMetadata({
      locale,
      path: legalPathByKind[kind],
      title: doc.metaTitle,
      description: doc.metaDescription,
      absoluteTitle: true,
    });
  };
}

export async function LegalScreen({ locale, kind }: { locale: string; kind: LegalKind }) {
  const t = getDictionary(locale);
  const lang = isLocale(locale) ? locale : "es";
  const path = legalPathByKind[kind];
  const doc = t.legal[kind];
  const url = localePath(lang, path);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-5">
      <PublicJsonLd
        locale={locale}
        url={url}
        t={t}
        variant="page"
        pageTitle={doc.title}
        crumbs={[
          { name: t.nav.home, url: localePath(lang) },
          { name: doc.title, url },
        ]}
      />
      <p className="text-[10px] uppercase tracking-[0.22em] text-sodium">{t.legal.nav.menu}</p>
      <div className="mt-3">
        <LegalDocument copy={t.legal} doc={doc} />
      </div>
    </div>
  );
}
