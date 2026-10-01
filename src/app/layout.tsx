import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { cookies } from "next/headers";
import { Oswald, Figtree } from "next/font/google";
import { defaultLocale, htmlLang, isLocale } from "@/i18n/config";
import "./globals.css";

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "700",
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Adopta un eBiker",
    template: "%s · Adopta un eBiker",
  },
  description:
    "Una comunidad ciclista para principiantes y veteranos, con bici eléctrica o convencional. Carretera, MTB y gravel.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://adoptaunebiker.com",
  ),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://adoptaunebiker.com",
    siteName: "Adopta un eBiker",
    images: [{ url: "/logo.png", width: 852, height: 456, alt: "Adopta un eBiker" }],
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookie = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = cookie && isLocale(cookie) ? cookie : defaultLocale;

  return (
    <html
      lang={htmlLang[locale]}
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="open-at-inicio" strategy="beforeInteractive">
          {`try{var nav=performance.getEntriesByType("navigation")[0];var p=location.pathname;var home=/^\\/(es|ca|en|fr|de)\\/?$/.test(p)||p==="/";if(home&&nav&&nav.type==="reload"){history.scrollRestoration="manual";window.scrollTo(0,0)}}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
