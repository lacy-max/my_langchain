"use client";
export default function PeonyHero() {
  return (
    <section className="relative h-screen flex items-center px-[90px] bg-[radial-gradient(circle_at_70%_45%,#3a1d12,#050403_60%)] overflow-hidden">
      <div className="w-[40%] z-10">
        <p className="text-[#c8a35a] tracking-[4px] text-sm">始于 1895</p>

        <h1 className="text-[58px] tracking-[8px] mt-5 mb-2">萃华珠宝</h1>

        <h2 className="text-[32px] font-normal tracking-[5px]">
          百年传承 匠心如初
        </h2>

        <button className="mt-7 px-8 py-3 border border-[#b9985b] text-[#f3dfb2] hover:bg-[#b9985b]/20 transition">
          探索珍品
        </button>
      </div>

      <img
        src="/images/peony.png"
        className="w-[740px] max-w-none object-cover scale-125"
      />
    </section>
  );
}
