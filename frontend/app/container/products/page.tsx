"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/app/components/layout";
import { fetchProducts } from "@/app/api/products";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/app/types/product";

const PAGE_SIZE = 8;

const CATEGORY_FALLBACK_IMAGE: Record<ProductCategory, string> = {
  黄金系列: "/images/gold.jpg",
  钻石系列: "/images/diamond.jpg",
  翡翠系列: "/images/jade.jpg",
  婚嫁系列: "/images/wedding.jpg",
};

function formatPrice(price: number) {
  return `¥${price.toLocaleString("zh-CN")}`;
}

function getFallbackImage(category: string) {
  return (
    CATEGORY_FALLBACK_IMAGE[category as ProductCategory] ?? "/images/gold.jpg"
  );
}

function ProductImage({ product }: { product: Product }) {
  const [src, setSrc] = useState(
    product.image || getFallbackImage(product.category),
  );

  return (
    <Image
      src={src}
      alt={product.name}
      width={200}
      height={210}
      onError={() => setSrc(getFallbackImage(product.category))}
      className="max-h-[210px] max-w-[78%] h-auto w-auto object-contain transition duration-700 group-hover:scale-105"
      sizes="(max-width: 1180px) 25vw, 280px"
    />
  );
}

export default function ProductsPage() {
  const [category, setCategory] = useState<ProductCategory>("黄金系列");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");
      try {
        const res = await fetchProducts({
          page: targetPage,
          page_size: PAGE_SIZE,
          category,
        });
        setProducts((prev) => (append ? [...prev, ...res.data] : res.data));
        setTotal(res.total);
        setPage(targetPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载商品失败");
        if (!append) {
          setProducts([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category],
  );

  useEffect(() => {
    loadProducts(1, false);
  }, [loadProducts]);

  const hasMore = products.length < total;

  return (
    <Layout>
      <section className="relative h-[420px] overflow-hidden bg-[#f8f2e8]">
        <Image
          src="/images/products-banner1.png"
          alt="产品系列"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </section>

      <section className="px-[90px] pt-12">
        <div className="mb-10 flex justify-center gap-24 text-[18px] tracking-[4px] text-[#4c3b2b]">
          {PRODUCT_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`pb-3 ${
                category === item
                  ? "border-b border-[#b88945] text-[#9a6a2f]"
                  : "hover:text-[#9a6a2f]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-20 text-center tracking-[2px] text-[#7c5425]">
            加载中...
          </p>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="tracking-[2px] text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => loadProducts(1, false)}
              className="mt-6 border border-[#b88945] px-8 py-2 tracking-[2px] text-[#7c5425] hover:bg-[#b88945]/10"
            >
              重试
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="py-20 text-center tracking-[2px] text-[#7c5425]">
            暂无商品
          </p>
        ) : (
          <div className="mx-auto grid max-w-[1180px] grid-cols-4 gap-6 mb-[20px]">
            {products.map((item) => (
              <Link
                key={item.id}
                href={`/container/products/${item.id}`}
                className="group overflow-hidden rounded-sm bg-[#090806] shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                aria-label={`查看${item.name}详情`}
              >
                <div className="flex h-[260px] items-center justify-center overflow-hidden">
                  <ProductImage key={item.id} product={item} />
                </div>

                <div className="border-t border-[#d6b165]/20 px-6 py-5 text-center">
                  <h3 className="text-[18px] tracking-[2px] text-[#f8e8c5]">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-[17px] text-[#dcc28c]">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {hasMore && !loading && !error && (
          <div className="flex justify-center py-16">
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => loadProducts(page + 1, true)}
              className="border border-[#b88945] px-10 py-3 tracking-[4px] text-[#7c5425] hover:bg-[#b88945]/10 disabled:opacity-50"
            >
              {loadingMore ? "加载中..." : "查看全部产品 →"}
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}
