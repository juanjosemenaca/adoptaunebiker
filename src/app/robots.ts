import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

const privatePaths = [
  "/intranet",
  "/admin",
  "/entrar",
  "/comunidad",
  "/principiante",
  "/veterano",
];

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          ...privatePaths,
          ...locales.flatMap((locale) =>
            privatePaths.map((path) => `/${locale}${path}`),
          ),
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ""),
  };
}
