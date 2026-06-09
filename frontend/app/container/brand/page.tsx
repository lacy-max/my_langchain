"use client";

import Image from "next/image";
import Layout from "@/app/components/layout";

const storyBlocks = [
  {
    eyebrow: "CRAFT",
    image: "/images/brand-craft-v2.png",
    title: "以手艺立骨，以光华成器。",
    desc: "金有其性，工有其法。萃华取材、制形、琢饰皆循分寸，让锋芒藏于细节，让珠宝在日常佩戴中自有仪度。",
  },
  {
    eyebrow: "ENCOUNTER",
    image: "/images/brand-store-v2.png",
    title: "入目为饰，入心为藏。",
    desc: "一件珠宝被选中，往往始于光泽，终于情意。萃华以从容相待，让婚嫁、礼赠与自珍之选，皆有可托付的郑重。",
  },
];

export default function BrandStory() {
  return (
    <Layout>
      <main className="bg-[#fbfaf7] text-[#17120e]">
        <section className="relative min-h-[720px] overflow-hidden bg-[#070504]">
          <Image
            src="/images/brand-hero-v2.png"
            alt="萃华珠宝品牌故事"
            fill
            priority
            className="object-cover opacity-95"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,3,0.95)_0%,rgba(5,4,3,0.78)_42%,rgba(5,4,3,0.08)_100%)]" />
          <div className="relative z-10 flex min-h-[720px] items-center px-8 pt-[76px] md:px-[90px]">
            <div className="max-w-[620px] text-[#f7ead3]">
              <p className="text-sm uppercase tracking-[7px] text-[#d5b16a]">
                CUIHUA SINCE 1895
              </p>
              <h1 className="mt-7 text-[42px] font-normal leading-tight md:text-[64px]">
                光华不言，岁月自有回响。
              </h1>
              <p className="mt-7 max-w-[520px] text-[17px] leading-9 text-[#e0cfad]">
                萃华起于金工，承于礼序。百余年间，所守不止技艺，
                亦是东方珠宝含蓄、郑重、可久藏的风骨。
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 py-24 md:px-[90px]">
          <div className="mx-auto grid max-w-[1120px] gap-12 md:grid-cols-[0.72fr_1fr] md:items-start">
            <p className="text-sm uppercase tracking-[6px] text-[#9a6a2f]">
              BRAND STORY
            </p>
            <div>
              <h2 className="max-w-[760px] text-[34px] font-normal leading-tight md:text-[48px]">
                百年所传，不止金玉之美。
              </h2>
              <p className="mt-8 max-w-[760px] text-[17px] leading-9 text-[#66513f]">
                萃华所珍视的，是材质的本真、工艺的秩序，也是人与人之间借珠宝寄托的心意。
                历史不必声张，真正的传承自会在每一次佩戴与珍藏中显影。
              </p>
            </div>
          </div>
        </section>

        {storyBlocks.map((item, index) => (
          <section
            key={item.title}
            className={`px-8 py-20 md:px-[90px] ${
              index === 1 ? "bg-[#11100d] text-[#f5e4c4]" : "bg-[#fbfaf7]"
            }`}
          >
            <div
              className={`mx-auto grid max-w-[1120px] gap-12 md:grid-cols-2 md:items-center ${
                index === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-[360px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div>
                <p
                  className={`text-sm uppercase tracking-[6px] ${
                    index === 1 ? "text-[#d5b16a]" : "text-[#9a6a2f]"
                  }`}
                >
                  {item.eyebrow}
                </p>
                <h2 className="mt-6 text-[34px] font-normal leading-tight md:text-[46px]">
                  {item.title}
                </h2>
                <p
                  className={`mt-7 text-[17px] leading-9 ${
                    index === 1 ? "text-[#d8c7a6]" : "text-[#66513f]"
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}
