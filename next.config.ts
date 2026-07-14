import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    cacheComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "places.googleapis.com",
      },

      {
        protocol: "https",
        hostname: "clhoxtrvpfhiaoppuxla.supabase.co",
      },
    ],
  },
};

export default nextConfig;
