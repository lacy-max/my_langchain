import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 设置项目根目录，解决多个 lockfiles 的问题
  turbopack: {
    root: ".",
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};
export default nextConfig;
