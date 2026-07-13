import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  /** Hide Next.js/Turbopack bottom-left badge in `next dev` (not shown in production). */
  devIndicators: false,
  compiler: {
    removeConsole: isDev ? false : { exclude: ["error", "warn"] },
  },
  images: {
    // Dev: skip sharp pipeline (avoids Windows/OneDrive hangs).
    // Prod: WebP only — no AVIF (AVIF encode stalls weak Node hosts like Hostinger).
    unoptimized: isDev,
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-*.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "image.thum.io",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "swiper"],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
