import Link from 'next/link';
import type { PageInfo } from '../pagination';
import { pageHref } from '../pagination';

const baseClass =
  'inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium';

export function Pagination({ basePath, info }: { basePath: string; info: PageInfo }) {
  if (info.totalPages <= 1) {
    return null;
  }
  return (
    <nav className="mt-12 flex items-center justify-between" aria-label="Pagination">
      {info.hasPrev ? (
        <Link
          href={pageHref(basePath, info.page - 1)}
          className={`${baseClass} text-gray-700 hover:bg-gray-50`}
        >
          ← Previous
        </Link>
      ) : (
        <span className={`${baseClass} cursor-not-allowed text-gray-300`}>← Previous</span>
      )}
      <span className="text-sm text-gray-500">
        Page {info.page} of {info.totalPages}
      </span>
      {info.hasNext ? (
        <Link
          href={pageHref(basePath, info.page + 1)}
          className={`${baseClass} text-gray-700 hover:bg-gray-50`}
        >
          Next →
        </Link>
      ) : (
        <span className={`${baseClass} cursor-not-allowed text-gray-300`}>Next →</span>
      )}
    </nav>
  );
}
