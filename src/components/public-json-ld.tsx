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
  const organizationId = `${origin}/#organization`;
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "SportsOrganization"],
    "@id": organizationId,
    name: "Adopta un eBiker",
    url: origin,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/logo.png`,
      width: 852,
      height: 456,
    },
    description: t.meta.description,
    sport: "Cycling",
    areaServed: "ES",
    knowsAbout: [
      "Ciclismo",
      "e-bike",
      "MTB",
      "Carretera",
      "Gravel",
      t.home.offerTitle,
    ],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Adopta un eBiker",
    url,
    inLanguage: locale,
    description: t.meta.description,
    publisher: { "@id": organizationId },
  };
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage: locale,
    isPartOf: { "@id": url },
    about: { "@id": organizationId },
    primaryImageOfPage: `${origin}/logo.png`,
  };
  const offers = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.home.offerTitle,
    description: t.home.offerLead,
    itemListElement: t.home.offerItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.body,
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offers) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
