"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Layout from "@/app/components/layout";
import PeonyBloom from "./components/peonyHero";
import Craft from "./components/craft";
import SeriesList from "./components/seriesList";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasPlayed = localStorage.getItem("peonyIntroPlayed");

    if (!hasPlayed) {
      setShowIntro(true);
      localStorage.setItem("peonyIntroPlayed", "true");

      setTimeout(() => {
        setShowIntro(false);
      }, 3200);
    }
  }, []);

  return (
    <Layout>
      <PeonyBloom></PeonyBloom>

      {/* 第二屏：百年工艺 */}
      <Craft></Craft>

      {/* 第三屏：产品系列 */}
      <SeriesList></SeriesList>
      {/* 第五屏：AI 珠宝顾问 */}
      <section className="h-[80vh] px-[110px] flex items-center justify-between bg-[#f7f1e8] text-[#21170f]">
        <div>
          <p className="text-[#c8a35a] tracking-[4px] text-sm">AI 珠宝顾问</p>

          <h2 className="text-[42px] mt-4 mb-4">专属顾问 智慧相伴</h2>

          <p className="text-[#6c5740]">
            为您提供专业的珠宝选购、门店查询与售后服务。
          </p>

          <div className="flex gap-4 mt-8">
            {["珠宝推荐", "知识咨询", "门店查询", "售后服务"].map((tag) => (
              <span
                key={tag}
                className="px-5 py-3 rounded-full border border-[#d6c7ad] text-[#5c4326]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="w-[520px] bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] p-7">
          <div className="flex items-center gap-3 font-bold">
            <MessageCircle size={18} />
            <span>萃华 AI 珠宝顾问</span>
          </div>

          <div className="my-7 p-5 bg-[#f5f1ea] rounded-xl text-[#4b3a29]">
            您好，我是萃华AI珠宝顾问，请问有什么可以帮您？
          </div>

          <div className="flex flex-wrap gap-3">
            {["预算5000怎么选？", "黄金保值吗？", "沈阳门店地址"].map(
              (question) => (
                <button
                  key={question}
                  className="px-4 py-2 border border-[#d8c7a8] text-[#5c4326] rounded-full text-sm hover:bg-[#f5f1ea]"
                >
                  {question}
                </button>
              )
            )}
          </div>

          <input
            placeholder="输入您的问题..."
            className="mt-6 w-full h-11 rounded-full border border-[#ddd2c1] px-5 outline-none"
          />
        </div>
      </section>
    </Layout>
  );
}
