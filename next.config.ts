import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/unirse", destination: "/es/entrar", permanent: false },
      { source: "/cuenta", destination: "/es/intranet/cuenta", permanent: false },
      { source: "/explorar", destination: "/es/intranet/explorar", permanent: false },
      { source: "/rider/:slug", destination: "/es/intranet/rider/:slug", permanent: false },
      { source: "/rutas", destination: "/es", permanent: false },
      { source: "/rutas/:slug", destination: "/es", permanent: false },
      { source: "/:locale/rutas", destination: "/:locale", permanent: false },
      { source: "/:locale/rutas/:slug", destination: "/:locale", permanent: false },
      { source: "/ebiker", destination: "/es?seccion=principiante", permanent: false },
      { source: "/:locale/unirse", destination: "/:locale/entrar", permanent: false },
      { source: "/:locale/ebiker", destination: "/:locale?seccion=principiante", permanent: false },
    ];
  },
};

export default nextConfig;
