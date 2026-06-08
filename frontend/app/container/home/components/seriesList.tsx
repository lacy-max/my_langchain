function SeriesList() {
  const seriesList = [
    {
      title: "黄金系列",
      desc: "传承东方美学",
      image: "/images/gold.jpg",
    },
    {
      title: "钻石系列",
      desc: "璀璨见证永恒",
      image: "/images/diamond.jpg",
    },
    {
      title: "翡翠系列",
      desc: "温润典雅 东方瑰宝",
      image: "/images/jade.jpg",
    },
    {
      title: "婚嫁系列",
      desc: "浪漫承诺 幸福相伴",
      image: "/images/wedding.jpg",
    },
  ];

  return (
    <section className="min-h-screen px-20 py-[120px] bg-[#090806] text-center">
      <p className="text-[#c8a35a] tracking-[4px] text-sm">东方之美 传世臻品</p>

      <h2 className="text-[42px] mt-4 mb-14">臻选系列</h2>

      <div className="grid grid-cols-4 gap-6">
        {seriesList.map((item) => (
          <div
            key={item.title}
            className="group relative h-[390px] overflow-hidden border border-[#d6b165]/30 bg-[#15110c]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute left-6 bottom-6 text-left">
              <h3 className="text-2xl mb-2">{item.title}</h3>
              <p className="text-[#dcc28c] text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default SeriesList;
