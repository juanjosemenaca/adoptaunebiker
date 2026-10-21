import { cookies } from "next/headers";
import Script from "next/script";
import { canLoadAnalytics, gaMeasurementId } from "@/lib/analytics";
import { parsePrivacyCookie, privacyCookieName } from "@/lib/privacy";

export async function AnalyticsScript() {
  const id = gaMeasurementId();
  if (!id) return null;
  const prefs = parsePrivacyCookie((await cookies()).get(privacyCookieName)?.value);
  if (!canLoadAnalytics(prefs)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
