import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { LandOnInicio } from "@/components/land-on-inicio";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSession } from "@/lib/session";

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : defaultLocale;
  const [session, t] = await Promise.all([getSession(), Promise.resolve(getDictionary(lang))]);
  return (
    <AppShell session={session} variant="public" locale={lang} t={t}>
      <LandOnInicio />
      {children}
    </AppShell>
  );
}
