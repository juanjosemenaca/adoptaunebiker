import type { Metadata } from 'next';
import { ArticleCard } from './components/ArticleCard';
import { Pagination } from './components/Pagination';
import { BLOG_BASE_PATH, SITE_NAME } from './constants';
import { blog } from './lib/blog-client';
import { paginate, parsePage } from './pagination';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'Latest articles, guides, and updates.',
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const articles = await blog.getAllArticles();
  const { items, info } = paginate(articles, parsePage(page));

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {SITE_NAME}
          </h1>
          <p className="mt-3 text-lg text-gray-600">Latest articles, guides, and updates.</p>
        </header>

        {items.length === 0 ? (
          <p className="text-gray-500">No articles have been published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <Pagination basePath={BLOG_BASE_PATH} info={info} />
      </div>
    </main>
  );
}
