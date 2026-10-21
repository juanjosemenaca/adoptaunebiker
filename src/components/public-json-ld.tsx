import type { Dictionary } from "@/i18n/types";
import { siteUrl } from "@/lib/site";

export function PublicJsonLd({
  locale,
  url,
  t,
  variant = "home",
  pageTitle,
  crumbs,
}: {
  locale: string;
  url: string;
  t: Dictionary;
  variant?: "home" | "page";
  pageTitle?: string;
  crumbs?: { name: string; url: string }[];
}) {
  const origin = siteUrl();
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "SportsOrganization"],
    "@id": organizationId,
    name: "Adopta un eBiker",
    url: origin,
    email: "hola@adoptaunebiker.com",
    logo: {
      "@type": "ImageObject",
      url: `${origin}/logo.png`,
      width: 852,
      height: 456,
    },
    description: t.meta.description,
    sport: "Cycling",
    areaServed: "ES",
    knowsAbout: ["Ciclismo", "e-bike", "MTB", "Carretera", "Gravel"],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: "Adopta un eBiker",
    url: origin,
    inLanguage: locale,
    description: t.meta.description,
    publisher: { "@id": organizationId },
  };
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: pageTitle ?? t.meta.title,
    description: t.meta.description,
    inLanguage: locale,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    primaryImageOfPage: `${origin}/logo.png`,
  };

  const graphs = [organization, website, webpage] as object[];

  if (variant === "home") {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  if (crumbs && crumbs.length > 0) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  return (
    <>
      {graphs.map((graph, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      ))}
    </>
  );
}
