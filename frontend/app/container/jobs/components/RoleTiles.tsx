import { BadgeCheck, Gem, Headset, MapPinned } from "lucide-react";

const tiles = [
  {
    title: "岗位推荐",
    desc: "匹配适合方向",
    icon: BadgeCheck,
  },
  {
    title: "珠宝培训",
    desc: "了解专业成长",
    icon: Gem,
  },
  {
    title: "门店驻场",
    desc: "查看城市机会",
    icon: MapPinned,
  },
  {
    title: "招聘服务",
    desc: "简历投递咨询",
    icon: Headset,
  },
];

function RoleTiles() {
  return (
    <section className="relative z-10 px-8 md:px-[90px]">
      <div className="mx-auto grid max-w-[1120px] overflow-hidden rounded-[8px] border border-white/80 bg-white/72 shadow-[0_22px_70px_rgba(128,92,43,0.12)] backdrop-blur md:grid-cols-4">
        {tiles.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex min-h-[154px] flex-col items-center justify-center border-b border-[#eadfce] px-6 text-center md:border-b-0 md:border-r md:last:border-r-0"
            >
              <Icon className="h-9 w-9 text-[#b88945]" strokeWidth={1.35} />
              <h3 className="mt-5 text-[21px] font-normal tracking-[2px] text-[#3a2b1e]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm tracking-[2px] text-[#9d8a73]">
                {item.desc}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RoleTiles;

