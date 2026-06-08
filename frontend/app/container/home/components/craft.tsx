"use client";
export default function Craft() {
  return (
    <section className="h-screen flex bg-[#f6efe4] text-[#25180f]">
      <div className="w-[42%] px-20 pt-[180px]">
        <p className="text-[#c8a35a] tracking-[4px] text-sm">
          百年工艺 代代相传
        </p>

        <h2 className="text-[42px] mt-4 mb-3">始于1895</h2>

        <h3 className="text-[28px] font-normal mb-6">历经百年，匠心传承</h3>

        <p className="leading-8 text-[#5a4734]">
          从传统工艺到现代美学，萃华珠宝始终坚持东方珠宝的温润气质与精湛工艺。
          每一件珠宝，都是时间、技艺与美学的沉淀。
        </p>

        <button className="mt-7 px-8 py-3 border border-[#8d6b3d] text-[#4b351d] hover:bg-[#8d6b3d]/10 transition">
          了解更多
        </button>
      </div>

      <div className="w-[58%] flex items-center justify-center">
        <img
          src="/images/craft.jpg"
          alt="珠宝工艺"
          className="
      w-full
      h-auto
      rounded-sm
      object-contain
    "
        />
      </div>
    </section>
  );
}
