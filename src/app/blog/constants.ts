export const BLOG_BASE_PATH = '/blog';

export const PAGE_SIZE = 12;

export const SITE_NAME = 'Blog';

export const REVALIDATE_SECONDS = process.env.NODE_ENV === 'development' ? 10 : 86400;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '');
