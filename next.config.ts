import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const hasCustomDomain = fs.existsSync(path.join(process.cwd(), "public", "CNAME"));
const defaultRepoPath = "/www.chrome_heaven.com";

// Use NEXT_PUBLIC_BASE_PATH only if it's explicitly set to a non-empty string.
// If running in GitHub Actions without a custom CNAME, auto-use the repo subpath.
// Otherwise (local dev or custom domain), use empty string.
const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath =
  envBasePath && envBasePath.trim() !== ""
    ? envBasePath
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
