import { Crown } from "lucide-react";

function JobsHero() {
  return (
    <section className="relative min-h-[610px] overflow-hidden bg-[#f5eee4] px-8 pt-[76px] md:px-[90px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.95)_0%,rgba(247,239,226,0.68)_32%,rgba(230,214,190,0.38)_68%,rgba(248,244,236,0.95)_100%)]" />
      <div className="absolute left-[-8%] right-[-8%] top-[275px] h-[150px] rounded-[50%] border-t border-white/85 bg-white/20 blur-[1px]" />
      <div className="absolute left-[-12%] right-[-12%] top-[330px] h-[170px] rounded-[50%] border-t border-[#dcc49d]/35 bg-white/25 blur-[2px]" />
      <div className="absolute left-1/2 top-[365px] h-[126px] w-[126px] -translate-x-1/2 rounded-full border border-white/80 bg-white/45 shadow-[0_0_70px_rgba(184,137,69,0.22)] backdrop-blur" />

      <div className="relative z-10 flex min-h-[534px] flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-[82px] w-[82px] items-center justify-center rounded-full border border-[#d7bd8d]/70 bg-white/60 shadow-[0_18px_60px_rgba(149,102,44,0.12)]">
          <Crown className="h-10 w-10 text-[#b88945]" strokeWidth={1.25} />
        </div>

        <div className="max-w-[760px]">
          <p className="text-sm uppercase tracking-[8px] text-[#a1743e]">
            CUIHUA CAREERS
          </p>
          <h1 className="mt-7 text-[46px] font-normal leading-tight text-[#2b2118] md:text-[68px]">
            萃华招聘顾问
          </h1>
          <p className="mt-5 text-[20px] tracking-[3px] text-[#8d7a64]">
            为你甄选合适的岗位方向
          </p>
        </div>
      </div>
    </section>
  );
}

export default JobsHero;
