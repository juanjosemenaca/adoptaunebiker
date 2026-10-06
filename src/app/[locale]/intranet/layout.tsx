import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ChangePasswordForm } from "@/components/change-password-form";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs, loginHref } from "@/lib/paths";
import { getSession, isAdmin } from "@/lib/session";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = privateMetadata("Intranet");

export default async function IntranetLayout({
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
  if (!session) redirect(loginHref(lang, links.intranet));
  if (isAdmin(session)) redirect(links.admin);
  const t = getDictionary(lang);

  if (session.mustChangePassword) {
    return (
      <AppShell session={session} variant="intranet" locale={lang} t={t} locked>
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">
            {t.intranet.plaza}
          </p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{t.intranet.changeTitle}</h1>
          <p className="mt-4 text-sm leading-7 text-mist">{t.intranet.changeLead}</p>
          <div className="mt-8 border border-line bg-rubber p-5">
            <ChangePasswordForm locale={lang} t={t} />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell session={session} variant="intranet" locale={lang} t={t}>
      {children}
    </AppShell>
  );
}
