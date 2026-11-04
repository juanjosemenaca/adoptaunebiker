import { BLOG_BASE_PATH, SITE_URL } from '../constants';
import { blog } from '../lib/blog-client';

export const revalidate = 86400;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: Request): Promise<Response> {
  // Sitemaps require absolute URLs. Prefer NEXT_PUBLIC_SITE_URL; fall back to the
  // request origin so the sitemap is never emitted with relative <loc> values.
  const baseUrl = SITE_URL || new URL(request.url).origin;
  const entries = await blog.getSitemapEntries();

  const urls = entries
    .map((entry) => {
      const loc = escapeXml(`${baseUrl}${BLOG_BASE_PATH}/${entry.slug}`);
      const date = new Date(entry.updated_at);
      const lastmod = Number.isNaN(date.getTime())
        ? ''
        : `\n    <lastmod>${date.toISOString()}</lastmod>`;
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
