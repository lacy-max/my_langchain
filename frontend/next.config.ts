import type { NextConfig } from "next";
import path from "path";
const nextConfig: NextConfig = {
  // 设置项目根目录，解决多个 lockfiles 的问题
  turbopack: {
    root: path.join(__dirname), // 将项目根目录设置为当前工作目录
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
