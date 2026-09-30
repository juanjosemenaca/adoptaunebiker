import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs, safeIntranetPath } from "@/lib/paths";
import { getSession, isAdmin } from "@/lib/session";

export default async function EntrarPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const session = await getSession();
  const next = safeIntranetPath(query.next, locale);

  if (session) {
    redirect(isAdmin(session) ? links.admin : links.intranet);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="display text-5xl sm:text-6xl">
        {t.login.title1}
        <br />
        {t.login.title2}
      </h1>
      <p className="mt-5 text-lg leading-8 text-mist">{t.login.lead}</p>
      <div className="mt-10">
        <LoginForm next={next} locale={locale} t={t} />
      </div>
      <p className="mt-6 text-xs leading-6 text-mist">{t.login.demo}</p>
    </div>
  );
}
