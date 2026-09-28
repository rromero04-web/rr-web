import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Con dos layouts raíz ((es) y en) no hay un layout común para la 404:
    // global-not-found.tsx la define para todas las URL que no existen.
    globalNotFound: true,
  },
};

export default nextConfig;
