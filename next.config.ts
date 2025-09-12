import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "s3.sa.ku.ac.th", 
    ],
  },
};

export default nextConfig;