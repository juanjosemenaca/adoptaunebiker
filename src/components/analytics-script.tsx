import { cookies } from "next/headers";
import Script from "next/script";
import { analyticsConsentCookie, gaMeasurementId } from "@/lib/analytics";

export async function AnalyticsScript() {
  const id = gaMeasurementId();
  if (!id) return null;
  const consent = (await cookies()).get(analyticsConsentCookie)?.value === "1";
  if (!consent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,allow_google_signals:false});`}
      </Script>
    </>
  );
}
