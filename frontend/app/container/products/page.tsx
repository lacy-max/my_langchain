// app/products/page.tsx
"use client";
import Layout from "@/app/components/layout";

const products = [
  {
    name: "花开富贵吊坠",
    price: "¥12,800",
    image: "/images/products/gold-1.png",
  },
  {
    name: "如意龙凤镯",
    price: "¥28,800",
    image: "/images/products/gold-2.png",
  },
  {
    name: "福禄双全吊坠",
    price: "¥9,800",
    image: "/images/products/gold-3.png",
  },
  {
    name: "凤凰璎珞耳环",
    price: "¥16,800",
    image: "/images/products/gold-4.png",
  },
  {
    name: "祥云如意戒指",
    price: "¥8,800",
    image: "/images/products/gold-5.png",
  },
  { name: "花丝手链", price: "¥15,800", image: "/images/products/gold-6.png" },
  { name: "传世平安扣", price: "¥6,800", image: "/images/products/gold-7.png" },
  {
    name: "古法传承手镯",
    price: "¥36,800",
    image: "/images/products/gold-8.png",
  },
];

export default function ProductsPage() {
  return (
    <Layout>
      {/* Banner */}
      <section className="relative h-[420px] overflow-hidden bg-[#f8f2e8]">
        <img
          src="/images/products-banner1.png"
          className="w-full h-[420px] pt-[76px] object-cover"
        />
      </section>

      {/* Tabs */}
      <section className="px-[90px] pt-12">
        <div className="mb-10 flex justify-center gap-24 text-[18px] tracking-[4px] text-[#4c3b2b]">
          {["黄金系列", "钻石系列", "翡翠系列", "婚嫁系列"].map(
            (item, index) => (
              <button
                key={item}
                className={`pb-3 ${
                  index === 0
                    ? "border-b border-[#b88945] text-[#9a6a2f]"
                    : "hover:text-[#9a6a2f]"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* Product Grid */}
        <div className="mx-auto grid max-w-[1180px] grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-sm bg-[#090806] shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-[260px] items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-[210px] max-w-[78%] object-contain transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="border-t border-[#d6b165]/20 px-6 py-5 text-center">
                <h3 className="text-[18px] tracking-[2px] text-[#f8e8c5]">
                  {item.name}
                </h3>
                <p className="mt-3 text-[17px] text-[#dcc28c]">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-16">
          <button className="border border-[#b88945] px-10 py-3 tracking-[4px] text-[#7c5425] hover:bg-[#b88945]/10">
            查看全部产品 →
          </button>
        </div>
      </section>
    </Layout>
  );
}
