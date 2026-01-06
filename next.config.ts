import { API_IMG_HOST } from '@/lib/globals';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: API_IMG_HOST,
      },
    ],
  }
};

export default nextConfig;
