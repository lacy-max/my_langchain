"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Gem,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Layout from "@/app/components/layout";
import { fetchStores } from "@/app/api/stores";
import type { Store } from "@/app/types/store";

const DEFAULT_CITY_OPTIONS = ["全部", "沈阳", "北京", "上海", "深圳", "成都"];

const serviceHighlights = [
  {
    icon: Gem,
    title: "珠宝甄选",
    text: "专业顾问陪同试戴，按预算、场景与风格推荐。",
  },
  {
    icon: ShieldCheck,
    title: "保养检测",
    text: "提供清洁养护、佩戴检查与售后咨询服务。",
  },
  {
    icon: Sparkles,
    title: "婚嫁预约",
    text: "为婚嫁套系、三金五金与高定需求预留专属时段。",
  },
];

export default function StoresPage() {
  const [activeCity, setActiveCity] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchStores({
        page: 1,
        page_size: 100,
        city: activeCity === "全部" ? undefined : activeCity,
        keyword: keyword.trim() || undefined,
      });
      setStores(res.data);
      setSelectedId((current) => {
        if (res.data.some((store) => store.id === current)) {
          return current;
        }
        return res.data[0]?.id ?? "";
      });
    } catch (err) {
      setStores([]);
      setSelectedId("");
      setError(err instanceof Error ? err.message : "门店加载失败");
    } finally {
      setLoading(false);
    }
  }, [activeCity, keyword]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const cityOptions = useMemo(() => {
    const cities = stores.map((store) => store.city);
    return Array.from(new Set([...DEFAULT_CITY_OPTIONS, ...cities]));
  }, [stores]);

  const selectedStore =
    stores.find((store) => store.id === selectedId) ?? stores[0];

  return (
    <Layout>
      <section className="relative min-h-[520px] overflow-hidden bg-[#090705] pt-[76px] text-[#f8ecd2]">
        <Image
          src="/images/stores-banner.png"
          alt="萃华珠宝门店"
          fill
          priority
          className="object-cover object-center opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,3,0.94),rgba(5,4,3,0.72)_38%,rgba(5,4,3,0.18)_72%,rgba(5,4,3,0.35))]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(9,7,5,0),rgba(9,7,5,0.78))]" />
        <div className="relative mx-auto flex min-h-[444px] max-w-[1180px] flex-col justify-center px-8">
          <p className="text-sm tracking-[6px] text-[#d8b56d]">
            CUIHUA STORE
          </p>
          <h1 className="mt-6 max-w-[620px] text-[52px] font-semibold leading-[1.15] tracking-[4px]">
            于近处甄选一件值得久藏的珠宝
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-8 text-[#eadab8]">
            萃华门店为每一次试戴、保养与婚嫁甄选预留从容时刻，让珠宝回到真实佩戴与重要纪念之中。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {["门店甄选", "预约顾问", "珠宝养护"].map((item) => (
              <span
                key={item}
                className="border border-[#d8b56d]/45 bg-[#090705]/35 px-6 py-3 text-sm tracking-[3px] text-[#f2dca8]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f1e7] px-8 py-16 text-[#23170f]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[1fr_410px] gap-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#d8c5a5] pb-8">
              <div>
                <p className="text-sm tracking-[5px] text-[#b88945]">
                  STORE LOCATOR
                </p>
                <h2 className="mt-3 text-[34px] font-medium tracking-[3px]">
                  门店查询
                </h2>
              </div>

              <label className="flex h-12 w-[320px] items-center gap-3 border border-[#d5c3a5] bg-white px-4 text-[#7c6546]">
                <Search size={18} />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="搜索城市、商圈或服务"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#a99983]"
                />
              </label>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {cityOptions.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setActiveCity(city);
                    setSelectedId("");
                  }}
                  className={`h-11 min-w-24 border px-5 text-sm tracking-[2px] transition ${
                    activeCity === city
                      ? "border-[#9f7335] bg-[#9f7335] text-white"
                      : "border-[#d5c3a5] bg-white text-[#6e5639] hover:border-[#9f7335] hover:text-[#9f7335]"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-5">
              {loading ? (
                <div className="border border-[#eadbc3] bg-white px-6 py-16 text-center tracking-[2px] text-[#7b5d32]">
                  门店加载中...
                </div>
              ) : error ? (
                <div className="border border-[#eadbc3] bg-white px-6 py-16 text-center">
                  <p className="tracking-[2px] text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={loadStores}
                    className="mt-6 border border-[#b88945] px-8 py-2 tracking-[2px] text-[#7c5425] hover:bg-[#b88945]/10"
                  >
                    重新加载
                  </button>
                </div>
              ) : stores.length ? (
                stores.map((store) => {
                  const isSelected = store.id === selectedStore.id;

                  return (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => setSelectedId(store.id)}
                      className={`group w-full border bg-white p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(80,55,25,0.12)] ${
                        isSelected
                          ? "border-[#b88945] shadow-[0_18px_45px_rgba(80,55,25,0.12)]"
                          : "border-[#eadbc3]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-[#21170f] px-3 py-1 text-xs tracking-[2px] text-[#f3d79b]">
                              {store.level}
                            </span>
                            <span className="text-sm tracking-[2px] text-[#9f7335]">
                              {store.city}
                            </span>
                          </div>
                          <h3 className="mt-4 text-[23px] font-medium tracking-[2px] text-[#24170d]">
                            {store.name}
                          </h3>
                        </div>
                        <ChevronRight
                          className={`mt-2 transition ${
                            isSelected
                              ? "translate-x-1 text-[#b88945]"
                              : "text-[#b8a17f] group-hover:translate-x-1"
                          }`}
                          size={22}
                        />
                      </div>

                      <div className="mt-5 grid gap-3 text-[15px] leading-7 text-[#685238]">
                        <p className="flex gap-3">
                          <MapPin
                            className="mt-1 shrink-0 text-[#b88945]"
                            size={17}
                          />
                          {store.address}
                        </p>
                        <p className="flex gap-3">
                          <Clock
                            className="mt-1 shrink-0 text-[#b88945]"
                            size={17}
                          />
                          {store.hours}
                        </p>
                        <p className="flex gap-3">
                          <Phone
                            className="mt-1 shrink-0 text-[#b88945]"
                            size={17}
                          />
                          {store.phone}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {store.services.map((service) => (
                          <span
                            key={service}
                            className="bg-[#f7efe2] px-3 py-1 text-xs tracking-[1px] text-[#7b5d32]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="border border-[#eadbc3] bg-white px-6 py-16 text-center text-[#7b5d32]">
                  暂未找到匹配门店，请尝试其他城市或关键词。
                </div>
              )}
            </div>
          </div>

          {selectedStore && (
          <aside className="sticky top-[100px] h-fit overflow-hidden border border-[#d8c5a5] bg-[#120d08] text-[#f8ecd2] shadow-[0_28px_70px_rgba(52,32,12,0.18)]">
            <div className="relative h-[250px] overflow-hidden">
              <Image
                src="/images/craft.jpg"
                alt={selectedStore.name}
                fill
                className="object-cover opacity-80"
                sizes="410px"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,13,8,0.1),rgba(18,13,8,0.92))]" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="flex items-center gap-2 text-sm tracking-[3px] text-[#f0ce82]">
                  <Star size={15} fill="currentColor" />
                  推荐到店
                </p>
                <h3 className="mt-3 text-[25px] font-medium tracking-[2px]">
                  {selectedStore.name}
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 border-b border-[#d8b56d]/25 pb-6 text-[15px] leading-7 text-[#eadab8]">
                <p className="flex gap-3">
                  <MapPin className="mt-1 shrink-0 text-[#d8b56d]" size={18} />
                  {selectedStore.address}
                </p>
                <p className="flex gap-3">
                  <Navigation
                    className="mt-1 shrink-0 text-[#d8b56d]"
                    size={18}
                  />
                  {selectedStore.distance}
                </p>
                <p className="flex gap-3">
                  <CalendarDays
                    className="mt-1 shrink-0 text-[#d8b56d]"
                    size={18}
                  />
                  今日营业 {selectedStore.hours}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedStore.phone.replaceAll(" ", "")}`}
                  className="flex h-12 items-center justify-center gap-2 bg-[#d8b56d] text-sm tracking-[2px] text-[#120d08] transition hover:bg-[#e5c47b]"
                >
                  <Phone size={16} />
                  电话咨询
                </a>
                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-2 border border-[#d8b56d]/55 text-sm tracking-[2px] text-[#f0ce82] transition hover:bg-[#d8b56d]/10"
                >
                  <CalendarDays size={16} />
                  预约到店
                </button>
              </div>

              <div className="mt-6 bg-[#1c140c] p-5">
                <p className="text-sm tracking-[3px] text-[#d8b56d]">
                  到店提示
                </p>
                <p className="mt-3 text-sm leading-7 text-[#d7c5a3]">
                  建议提前预约顾问并备注预算、用途与喜欢的材质，门店会为您预留试戴时段。
                </p>
              </div>
            </div>
          </aside>
          )}
        </div>
      </section>

      <section className="bg-[#fffaf2] px-8 py-16 text-[#23170f]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-3 gap-6">
          {serviceHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="border border-[#eadbc3] p-8">
                <Icon className="text-[#b88945]" size={30} />
                <h3 className="mt-6 text-[22px] font-medium tracking-[2px]">
                  {item.title}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[#725b3f]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
