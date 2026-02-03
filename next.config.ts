import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // 允许 Sanity 的图片
      },
    ],
  },
};

export default nextConfig;
