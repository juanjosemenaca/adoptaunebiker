import Link from "next/link";
import { getDictionary } from "@/i18n/get-dictionary";
import { dateLocale, isLocale } from "@/i18n/config";
import { formatBlogDate } from "@/lib/blog";
import { listAdminBlogPosts } from "@/lib/blog-admin";
import { hrefs } from "@/lib/paths";

export default async function AdminBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = isLocale(locale) ? locale : "es";
  let posts: Awaited<ReturnType<typeof listAdminBlogPosts>> = [];
  let loadError = "";
  try {
    posts = await listAdminBlogPosts();
  } catch {
    loadError = t.errors.blog;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-6xl sm:text-7xl">{t.admin.blogTitle}</h1>
          <p className="mt-4 max-w-xl text-mist">{t.admin.blogLead}</p>
        </div>
        <Link href={links.adminBlogNew} className="inline-flex min-h-11 items-center bg-sodium px-4 text-[11px] font-semibold tracking-[0.16em] uppercase text-bone">
          {t.admin.blogNew}
        </Link>
      </div>

      {loadError ? <p className="mt-12 text-mist">{loadError}</p> : null}
      {!loadError && posts.length === 0 ? <p className="mt-12 text-mist">{t.admin.blogEmpty}</p> : null}

      {posts.length > 0 ? (
        <ul className="mt-12 divide-y divide-line border border-line bg-rubber">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={links.adminBlogPost(post.id)} className="flex flex-col gap-1 px-5 py-4 hover:bg-asphalt sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base text-bone">{post.title}</p>
                  <p className="mt-1 text-sm text-mist">{post.subtitle || post.slug}</p>
                </div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist">
                  {post.published ? t.admin.blogPublished : t.admin.blogDraft}
                  {post.publishedAt ? ` · ${formatBlogDate(post.publishedAt, dateLocale[lang])}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
