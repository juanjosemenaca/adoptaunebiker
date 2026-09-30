import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs, loginHref } from "@/lib/paths";
import { getSession, isAdmin } from "@/lib/session";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : defaultLocale;
  const session = await getSession();
  const links = hrefs(lang);
  if (!session) redirect(loginHref(lang, links.admin));
  if (!isAdmin(session)) redirect(links.intranet);
  const t = getDictionary(lang);

  return (
    <AppShell session={session} variant="admin" locale={lang} t={t}>
      {children}
    </AppShell>
  );
}
