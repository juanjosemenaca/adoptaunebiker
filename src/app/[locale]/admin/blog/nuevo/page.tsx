import { BlogEditor } from "@/components/blog-editor";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AdminBlogNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : defaultLocale;
  const t = getDictionary(lang);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl">{t.admin.blogNew}</h1>
      <p className="mt-4 text-mist">{t.admin.blogLead}</p>
      <BlogEditor locale={lang} t={t} />
    </div>
  );
}
