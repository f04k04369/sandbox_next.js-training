import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true
    },
  },
  experimental: {
    cacheComponents: true,
  }
};

export default nextConfig;
