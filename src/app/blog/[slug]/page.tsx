import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd } from '../components/ArticleJsonLd';
import { TagList } from '../components/TagList';
import { BLOG_BASE_PATH, SITE_URL } from '../constants';
import { formatDate } from '../format';
import { blog } from '../lib/blog-client';
import '../blog-content.css';

export const revalidate = 86400;

export async function generateStaticParams() {
  const articles = await blog.getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await blog.getArticleBySlug(slug);
  if (!article) {
    return {};
  }
  const canonical = SITE_URL ? `${SITE_URL}${BLOG_BASE_PATH}/${article.slug}` : undefined;
  return {
    title: article.title,
    description: article.meta_description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.meta_description,
      url: canonical,
      images: article.hero_image_url ? [{ url: article.hero_image_url }] : undefined,
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await blog.getArticleBySlug(slug);
  if (!article || !article.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ArticleJsonLd data={article.jsonLd} />
        <ArticleJsonLd data={article.faqJsonLd} />

        <Link
          href={BLOG_BASE_PATH}
          className="text-sm font-medium text-gray-500 transition hover:text-gray-700"
        >
          ← All articles
        </Link>

        <article className="mt-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {article.title}
            </h1>
            <time dateTime={article.published_at} className="mt-4 block text-sm text-gray-500">
              {formatDate(article.published_at)}
            </time>
          </header>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />

          <footer className="mt-12 border-t border-gray-100 pt-6">
            <TagList keywords={[article.seedKeyword ?? '', ...article.keywords]} />
          </footer>
        </article>
      </div>
    </main>
  );
}
