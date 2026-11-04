import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/blog-editor";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAdminBlogPost } from "@/lib/blog-admin";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const lang = isLocale(locale) ? locale : defaultLocale;
  const t = getDictionary(lang);
  const post = await getAdminBlogPost(id).catch(() => null);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl">{t.admin.blogEdit}</h1>
      <p className="mt-4 text-mist">{t.admin.blogLead}</p>
      <BlogEditor post={post} locale={lang} t={t} />
    </div>
  );
}
