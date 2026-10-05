import type { NextConfig } from "next";

const supabaseUrlForBuild =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabaseKeyForBuild =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  "";

console.info(
  "[adopta] next.config env",
  JSON.stringify({
    hasUrl: Boolean(supabaseUrlForBuild.trim()),
    hasKey: Boolean(supabaseKeyForBuild.trim()),
  }),
);

const nextConfig: NextConfig = {
  ...(supabaseUrlForBuild.trim() && supabaseKeyForBuild.trim()
    ? {
        env: {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrlForBuild,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabaseKeyForBuild,
        },
      }
    : {}),
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.adoptaunebiker.com" }],
        destination: "https://adoptaunebiker.com/:path*",
        permanent: true,
      },
      { source: "/unirse", destination: "/es?seccion=crear-plaza", permanent: true },
      { source: "/cuenta", destination: "/es/intranet/cuenta", permanent: true },
      { source: "/explorar", destination: "/es/intranet/explorar", permanent: true },
      { source: "/rider/:slug", destination: "/es/intranet/rider/:slug", permanent: true },
      { source: "/rutas", destination: "/es", permanent: true },
      { source: "/rutas/:slug", destination: "/es", permanent: true },
      { source: "/:locale/rutas", destination: "/:locale", permanent: true },
      { source: "/:locale/rutas/:slug", destination: "/:locale", permanent: true },
      { source: "/ebiker", destination: "/es?seccion=principiante", permanent: true },
      { source: "/:locale/unirse", destination: "/:locale?seccion=crear-plaza", permanent: true },
      { source: "/:locale/ebiker", destination: "/:locale?seccion=principiante", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
