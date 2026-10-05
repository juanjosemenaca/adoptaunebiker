import type { Dictionary } from "@/i18n/types";
import { siteUrl } from "@/lib/site";

export function PublicJsonLd({
  locale,
  url,
  t,
}: {
  locale: string;
  url: string;
  t: Dictionary;
}) {
  const origin = siteUrl();
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Adopta un eBiker",
    url,
    inLanguage: locale,
    description: t.meta.description,
    publisher: { "@id": `${origin}/#organization` },
  };
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: "Adopta un eBiker",
    url: origin,
    logo: `${origin}/logo.png`,
    description: t.meta.description,
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
