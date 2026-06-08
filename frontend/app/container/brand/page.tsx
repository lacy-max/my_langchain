"use client";

import Layout from "@/app/components/layout";

export default function BrandStory() {
  return (
    <Layout>
      {/* 第一屏 */}
      <section className="w-full">
        <img
          src="/images/section_1.png"
          alt=""
          className="w-full object-cover"
        />
      </section>

      {/* 第二屏 */}
      <section className="w-full">
        <img
          src="/images/section_2.png"
          alt=""
          className="w-full object-cover"
        />
      </section>

      {/* 第三屏 */}
      <section className="w-full">
        <img
          src="/images/section_3.png"
          alt=""
          className="w-full object-cover"
        />
      </section>

      {/* 第四屏 */}
      <section className="w-full">
        <img
          src="/images/section_4.png"
          alt=""
          className="w-full object-cover"
        />
      </section>
    </Layout>
  );
}
