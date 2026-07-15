import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "f.wishabi.net" },
      { protocol: "https", hostname: "flipp-image-retrieval.flipp.com" },
    ],
  },
};

export default nextConfig;
