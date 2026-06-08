import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["antd", "@ant-design/pro-components"],
  turbopack: {
    root: path.join(__dirname),
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/api/:path*",
    },
  ],
};

export default nextConfig;
