import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '../../components/ArticleCard';
import { Pagination } from '../../components/Pagination';
import { BLOG_BASE_PATH } from '../../constants';
import { blog } from '../../lib/blog-client';
import { paginate, parsePage } from '../../pagination';

export const revalidate = 86400;

export async function generateStaticParams() {
  const tags = await blog.getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Articles tagged “${slug}”` };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const articles = await blog.getArticlesByTag(slug);
  if (articles.length === 0) {
    notFound();
  }
  const basePath = `${BLOG_BASE_PATH}/tag/${slug}`;
  const { items, info } = paginate(articles, parsePage(page));

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <header className="mb-10">
          <Link
            href={BLOG_BASE_PATH}
            className="text-sm font-medium text-gray-500 transition hover:text-gray-700"
          >
            ← All articles
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            #{slug}
          </h1>
          <p className="mt-3 text-gray-600">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <Pagination basePath={basePath} info={info} />
      </div>
    </main>
  );
}
