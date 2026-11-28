import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "",
  outputFileTracingRoot: path.join(__dirname),
  images: { unoptimized: true },
};

export default nextConfig;
