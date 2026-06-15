"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Gem, ShieldCheck } from "lucide-react";
import Layout from "@/app/components/layout";
import { fetchProduct, fetchProducts } from "@/app/api/products";
import {
  type Product,
  type ProductCategory,
} from "@/app/types/product";

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

function ProductVisual({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const [src, setSrc] = useState(
    product.image || getFallbackImage(product.category),
  );

  return (
    <Image
      src={src}
      alt={product.name}
      width={compact ? 220 : 680}
      height={compact ? 220 : 680}
      onError={() => setSrc(getFallbackImage(product.category))}
      className={`h-full w-full object-contain ${
        compact ? "transition duration-500 group-hover:scale-105" : ""
      }`}
      sizes={compact ? "(max-width: 768px) 80vw, 280px" : "(max-width: 1024px) 100vw, 50vw"}
      priority={!compact}
    />
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const detail = await fetchProduct(productId);
      setProduct(detail.data);

      const related = await fetchProducts({
        page: 1,
        page_size: 4,
        category: detail.data.category,
      });
      setRelatedProducts(
        related.data.filter((item) => item.id !== productId).slice(0, 3),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品详情加载失败");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return (
    <Layout>
      <main className="min-h-screen bg-[#f7f1e8] px-6 pb-20 pt-[116px] text-[#2b2017] md:px-[90px]">
        <div className="mx-auto max-w-[1180px]">
          <nav className="mb-8 flex items-center gap-2 text-sm text-[#806c58]">
            <Link
              href="/container/products"
              className="inline-flex items-center gap-2 hover:text-[#9a6a2f]"
            >
              <ArrowLeft className="h-4 w-4" />
              商品列表
            </Link>
            {product && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span>{product.name}</span>
              </>
            )}
          </nav>

          {loading ? (
            <div className="flex min-h-[560px] items-center justify-center text-[#806c58]">
              商品详情加载中...
            </div>
          ) : error || !product ? (
            <div className="flex min-h-[560px] flex-col items-center justify-center">
              <p className="text-lg text-[#8f3f37]">{error || "商品不存在"}</p>
              <button
                type="button"
                onClick={loadProduct}
                className="mt-6 border border-[#b88945] px-8 py-3 text-[#7c5425] hover:bg-[#b88945]/10"
              >
                重新加载
              </button>
            </div>
          ) : (
            <>
              <section className="grid overflow-hidden border border-[#e4d5c0] bg-[#fffdf8] lg:grid-cols-[1.08fr_0.92fr]">
                <div className="flex min-h-[460px] items-center justify-center bg-[#15120e] p-8 md:min-h-[620px] md:p-14">
                  <div className="aspect-square w-full max-w-[540px]">
                    <ProductVisual product={product} />
                  </div>
                </div>

                <div className="flex flex-col justify-center px-7 py-10 md:px-14 md:py-16">
                  <p className="text-sm tracking-[5px] text-[#9a6a2f]">
                    {product.category}
                  </p>
                  <h1 className="mt-5 text-[34px] font-normal leading-tight md:text-[46px]">
                    {product.name}
                  </h1>
                  <p className="mt-7 text-[28px] text-[#9a6a2f]">
                    {formatPrice(product.price)}
                  </p>
                  <div className="my-9 h-px bg-[#e4d5c0]" />
                  <p className="text-[17px] leading-8 text-[#695847]">
                    {product.description || "经典珠宝设计，细节与寓意兼具。"}
                  </p>

                  <div className="mt-10 grid gap-5 border-y border-[#e4d5c0] py-7 text-sm text-[#695847] sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Gem className="h-5 w-5 text-[#b88945]" />
                      <span>系列：{product.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-[#b88945]" />
                      <span>商品信息以当前目录为准</span>
                    </div>
                  </div>

                  <Link
                    href="/container/chat"
                    className="mt-9 flex min-h-[52px] items-center justify-center bg-[#a97938] px-8 py-4 text-center tracking-[3px] text-white transition hover:bg-[#8c612f]"
                  >
                    咨询 AI 珠宝顾问
                  </Link>
                </div>
              </section>

              {relatedProducts.length > 0 && (
                <section className="pt-16">
                  <div className="mb-8 flex items-end justify-between">
                    <div>
                      <p className="text-sm tracking-[5px] text-[#9a6a2f]">
                        SAME SERIES
                      </p>
                      <h2 className="mt-3 text-[30px] font-normal">同系列商品</h2>
                    </div>
                    <Link
                      href="/container/products"
                      className="text-sm text-[#7c5425] hover:text-[#9a6a2f]"
                    >
                      查看全部
                    </Link>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {relatedProducts.map((item) => (
                      <Link
                        key={item.id}
                        href={`/container/products/${item.id}`}
                        className="group overflow-hidden bg-[#15120e]"
                      >
                        <div className="flex aspect-[4/3] items-center justify-center p-7">
                          <ProductVisual product={item} compact />
                        </div>
                        <div className="border-t border-[#d6b165]/20 px-6 py-5">
                          <h3 className="text-lg text-[#f8e8c5]">{item.name}</h3>
                          <p className="mt-2 text-[#dcc28c]">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
