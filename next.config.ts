import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const hasCustomDomain = fs.existsSync(path.join(process.cwd(), "public", "CNAME"));
const defaultRepoPath = "/www.chrome_heaven.com";

// If NEXT_PUBLIC_BASE_PATH is explicitly set, use it.
// If running in GitHub Actions without a custom CNAME, default to repository subpath.
// Otherwise (local development or custom domain), use empty string.
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.GITHUB_ACTIONS === "true" && !hasCustomDomain
    ? defaultRepoPath
    : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i1.sndcdn.com",
      },
      {
        protocol: "https",
        hostname: "*.sndcdn.com",
      },
    ],
  },
};

export default nextConfig;
