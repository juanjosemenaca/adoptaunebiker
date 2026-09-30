import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/unirse", destination: "/entrar", permanent: false },
      { source: "/cuenta", destination: "/intranet/cuenta", permanent: false },
      { source: "/explorar", destination: "/intranet/explorar", permanent: false },
      { source: "/rider/:slug", destination: "/intranet/rider/:slug", permanent: false },
      { source: "/rutas", destination: "/", permanent: false },
      { source: "/rutas/:slug", destination: "/", permanent: false },
      { source: "/ebiker", destination: "/principiante", permanent: false },
    ];
  },
};

export default nextConfig;
