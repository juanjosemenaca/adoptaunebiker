import { cookies } from "next/headers";
import Script from "next/script";
import {
  analyticsInlineConfig,
  analyticsScriptId,
  analyticsScriptSrc,
  canLoadAnalytics,
  gaMeasurementId,
  gtmContainerId,
  gtmInlineBootstrap,
  gtmNoscriptSrc,
  gtmScriptId,
} from "@/lib/analytics";
import { parsePrivacyCookie, privacyCookieName } from "@/lib/privacy";

export async function AnalyticsScript() {
  const ga = gaMeasurementId();
  const gtm = gtmContainerId();
  const prefs = parsePrivacyCookie((await cookies()).get(privacyCookieName)?.value);
  if (!canLoadAnalytics(prefs, ga, gtm)) return null;

  const gtmBootstrap = gtm ? gtmInlineBootstrap(gtm) : "";
  const noscriptSrc = gtm ? gtmNoscriptSrc(gtm) : "";
  const gaSrc = !gtm && ga ? analyticsScriptSrc(ga) : "";
  const gaInline = !gtm && ga ? analyticsInlineConfig(ga) : "";

  return (
    <>
      {gtmBootstrap ? (
        <Script id={gtmScriptId} strategy="afterInteractive">
          {gtmBootstrap}
        </Script>
      ) : null}
      {noscriptSrc ? (
        <noscript>
          <iframe
            src={noscriptSrc}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      ) : null}
      {gaSrc && gaInline ? (
        <>
          <Script src={gaSrc} strategy="afterInteractive" />
          <Script id={analyticsScriptId} strategy="afterInteractive">
            {gaInline}
          </Script>
        </>
      ) : null}
    </>
  );
}
