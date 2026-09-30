import Link from "next/link";
import { cookies } from "next/headers";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";

export default async function NotFound() {
  const cookie = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = cookie && isLocale(cookie) ? cookie : defaultLocale;
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">
        {t.notFound.kicker}
      </p>
      <h1 className="display mt-3 text-6xl">{t.notFound.title}</h1>
      <p className="mt-4 text-mist">{t.notFound.body}</p>
      <Link
        href={hrefs(locale).home}
        className="mt-8 inline-flex bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
