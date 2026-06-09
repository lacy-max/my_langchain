type CultureItem = {
  title: string;
  desc: string;
};

type CultureSectionProps = {
  items: CultureItem[];
};

function CultureSection({ items }: CultureSectionProps) {
  return (
    <section className="px-8 py-20 md:px-[90px]">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[6px] text-[#9a6a2f]">
              OUR WAY
            </p>
            <h2 className="mt-5 text-[40px] font-normal leading-tight text-[#2a2118]">
              与珠宝相处，也与人相处。
            </h2>
          </div>
          <p className="text-[17px] leading-9 text-[#75614c]">
            萃华的工作，关乎审美、专业与信任。我们希望每一位加入者，都能在稳妥的日常里建立自己的长期价值。
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-[8px] border border-[#eadfce] bg-white/68 px-7 py-8 shadow-[0_18px_44px_rgba(128,92,43,0.08)]"
            >
              <h3 className="text-[24px] font-normal text-[#2a2118]">
                {item.title}
              </h3>
              <p className="mt-5 leading-8 text-[#75614c]">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CultureSection;
