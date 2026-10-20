import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const pages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  ...(pages
    ? {
        output: "export",
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
        images: { unoptimized: true },
      }
    : {
        allowedDevOrigins: ["127.0.0.1", "localhost", "*.agent.cvm.dev"],
        cacheComponents: true,
        partialPrefetching: true,
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
