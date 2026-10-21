import { cookies } from "next/headers";
import Script from "next/script";
import {
  analyticsInlineConfig,
  analyticsScriptId,
  analyticsScriptSrc,
  canLoadAnalytics,
  gaMeasurementId,
} from "@/lib/analytics";
import { parsePrivacyCookie, privacyCookieName } from "@/lib/privacy";

export async function AnalyticsScript() {
  const id = gaMeasurementId();
  const prefs = parsePrivacyCookie((await cookies()).get(privacyCookieName)?.value);
  if (!canLoadAnalytics(prefs, id)) return null;
  const src = analyticsScriptSrc(id);
  const inline = analyticsInlineConfig(id);
  if (!src || !inline) return null;

  return (
    <>
      <Script src={src} strategy="afterInteractive" />
      <Script id={analyticsScriptId} strategy="afterInteractive">
        {inline}
      </Script>
    </>
  );
}
