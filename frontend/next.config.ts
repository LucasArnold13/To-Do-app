import type { NextConfig } from "next";

 const nextConfig: NextConfig = {
  experimental: {
     // @ts-ignore
    allowedDevOrigins: [
      "http://127.0.0.1:8080",
      "http://localhost:8080",
    ],
  },
};

export default nextConfig;
