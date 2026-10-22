import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { PrivacyProvider } from "@/components/privacy-provider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { isAnalyticsConfigured } from "@/lib/analytics";
import { parsePrivacyCookie, privacyCookieName } from "@/lib/privacy";

export async function PrivacyGate({
  children,
  locale,
  t,
}: {
  children: ReactNode;
  locale: Locale;
  t: Dictionary;
}) {
  const prefs = parsePrivacyCookie((await cookies()).get(privacyCookieName)?.value);
  return (
    <PrivacyProvider
      locale={locale}
      copy={t.legal}
      initialPrefs={prefs}
      analyticsConfigured={isAnalyticsConfigured()}
    >
      {children}
    </PrivacyProvider>
  );
}
