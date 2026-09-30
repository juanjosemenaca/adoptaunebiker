import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Oswald, Figtree } from "next/font/google";
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
  icons: { icon: "/logo-mark.png", apple: "/logo-mark.png" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://adoptaunebiker.com",
    siteName: "Adopta un eBiker",
    images: [{ url: "/logo.png", width: 1024, height: 512, alt: "Adopta un eBiker" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="open-at-inicio" strategy="beforeInteractive">
          {`try{var nav=performance.getEntriesByType("navigation")[0];if(location.pathname==="/"&&nav&&(nav.type==="reload"||nav.type==="navigate")){history.scrollRestoration="manual";window.scrollTo(0,0)}}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
