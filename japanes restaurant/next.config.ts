import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "",
  outputFileTracingRoot: path.join(__dirname),
  images: { unoptimized: true },
};

export default nextConfig;
