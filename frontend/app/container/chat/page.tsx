"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Crown, Send, Sparkles, UserRound } from "lucide-react";
import Layout from "@/app/components/layout";
import {
  chatMessage,
  fetchChatHistory,
  type ChatSource,
} from "@/app/api/chat";
import { fetchProducts } from "@/app/api/products";
import type { Product } from "@/app/types/product";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  ticketId?: string;
  sources?: ChatSource[];
};

const starters = ["推荐礼物", "退货流程", "会员权益", "门店服务"];
const SESSION_ID = "primary";
const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "您好，我是萃华 AI 珠宝顾问。您可以咨询珠宝选购、门店服务、会员权益、物流发票与售后问题。",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [productCatalog, setProductCatalog] = useState<Product[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    fetchChatHistory(SESSION_ID)
      .then((response) => {
        if (!active) {
          return;
        }
        const history = response.data.map((item) => ({
          id: item.id,
          role: item.role,
          content: item.content,
          intent: item.intent,
          ticketId: item.ticket_id,
          sources: item.sources,
        }));
        setMessages(history.length > 0 ? history : [WELCOME_MESSAGE]);
      })
      .catch(() => {
        if (active) {
          setMessages([WELCOME_MESSAGE]);
        }
      })
      .finally(() => {
        if (active) {
          setHistoryLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetchProducts({ page: 1, page_size: 100 })
      .then((response) => {
        if (!active) {
          return;
        }
        setProductCatalog(response.data);
      })
      .catch(() => {
        if (active) {
          setProductCatalog([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (!container) {
        return;
      }
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || loading || historyLoading) {
      return;
    }

    setValue("");
    setLoading(true);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await chatMessage({
        message: question,
        session_id: SESSION_ID,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: res.data.message_id || `assistant-${Date.now()}`,
          role: "assistant",
          content: res.data.reply,
          intent: res.data.intent,
          ticketId: res.data.ticket_id,
          sources: res.data.sources,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "AI 顾问暂时无法响应，请稍后再试。",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-[#f6efe5] px-6 pb-16 pt-[112px] text-[#241912] md:px-[90px]">
        <section className="mx-auto max-w-[1120px]">
          <div className="relative overflow-hidden rounded-[8px] border border-white/80 bg-white/68 px-8 py-14 text-center shadow-[0_24px_80px_rgba(128,92,43,0.13)] backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95)_0%,rgba(247,239,226,0.4)_50%,transparent_100%)]" />
            <div className="relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d7bd8d]/70 bg-white/70">
                <Crown className="h-8 w-8 text-[#b88945]" strokeWidth={1.3} />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[7px] text-[#a1743e]">
                CUIHUA AI ADVISOR
              </p>
              <h1 className="mt-5 text-[42px] font-normal leading-tight md:text-[62px]">
                AI 珠宝顾问
              </h1>
              <p className="mt-4 text-[18px] tracking-[3px] text-[#8d7a64]">
                连接 LangChain · LangGraph · RAG 知识库
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <section className="rounded-[8px] border border-white/80 bg-white/76 shadow-[0_24px_80px_rgba(128,92,43,0.13)] backdrop-blur">
              <div
                ref={messagesContainerRef}
                className="max-h-[620px] min-h-[520px] overflow-y-auto px-6 py-7 md:px-8"
              >
                <div className="space-y-6">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      productCatalog={productCatalog}
                    />
                  ))}
                  {historyLoading && (
                    <div className="flex items-center gap-3 text-[#8d7a64]">
                      <Bot className="h-5 w-5 text-[#b88945]" />
                      <span>正在加载历史记录...</span>
                    </div>
                  )}
                  {loading && (
                    <div className="flex items-center gap-3 text-[#8d7a64]">
                      <Bot className="h-5 w-5 text-[#b88945]" />
                      <span>正在帮您查询...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-[#eadfce] p-5">
                <div className="mb-4 flex flex-wrap gap-3">
                  {starters.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => sendMessage(starter)}
                      className="rounded-full border border-[#e0d3bf] bg-[#fbf7ef] px-5 py-2 text-sm tracking-[2px] text-[#6b5745] hover:border-[#b88945]"
                    >
                      {starter}
                    </button>
                  ))}
                </div>

                <div className="flex min-h-[96px] items-center gap-3 rounded-[8px] border border-[#e0d3bf] bg-[#fffdf8] px-4 py-4">
                  <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage(value);
                      }
                    }}
                    placeholder="请输入您的问题..."
                    className="h-12 min-h-12 max-h-24 flex-1 resize-none bg-transparent px-2 py-2 leading-8 text-[#2a2118] outline-none"
                  />
                  <button
                    type="button"
                    disabled={historyLoading || loading || value.trim() === ""}
                    onClick={() => sendMessage(value)}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#b88945] text-white transition hover:bg-[#9a6a2f] disabled:cursor-not-allowed disabled:opacity-45"
                    aria-label="发送"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </section>

            <aside className="rounded-[8px] border border-white/80 bg-white/62 p-7 shadow-[0_22px_70px_rgba(128,92,43,0.11)] backdrop-blur">
              <div className="flex items-center gap-3 text-[#9a6a2f]">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[5px]">
                  Knowledge
                </span>
              </div>
              <h2 className="mt-5 text-[28px] font-normal">知识库范围</h2>
              <div className="mt-6 grid gap-3 text-[#6b5745]">
                {[
                  "退货与售后",
                  "发货与物流",
                  "会员与积分",
                  "支付与发票",
                  "人工客服",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-[#e0d3bf] bg-[#fbf7ef] px-5 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function MessageBubble({
  message,
  productCatalog,
}: {
  message: ChatMessage;
  productCatalog: Product[];
}) {
  const isUser = message.role === "user";

  return (
    <article
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3e4cf] text-[#b88945]">
          <Bot className="h-5 w-5" />
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-[8px] px-5 py-4 leading-8 shadow-sm ${
          isUser
            ? "bg-[#b88945] text-white"
            : "border border-[#eadfce] bg-[#fffdf8] text-[#3a2b1e]"
        }`}
      >
        <p className="whitespace-pre-wrap">
          <MessageContent
            content={message.content}
            productCatalog={productCatalog}
          />
        </p>
        {/* {!isUser && (message.intent || message.ticketId || message.sources?.length) && (
          <div className="mt-4 border-t border-[#eadfce] pt-3 text-sm text-[#8d7a64]">
            {message.intent && <p>意图：{message.intent}</p>}
            {message.ticketId && <p>工单：{message.ticketId}</p>}
            {message.sources && message.sources.length > 0 && (
              <p>来源：{message.sources.map((source) => source.source).join("、")}</p>
            )}
          </div>
        )} */}
      </div>

      {isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe5d7] text-[#7c5425]">
          <UserRound className="h-5 w-5" />
        </div>
      )}
    </article>
  );
}

function MessageContent({
  content,
  productCatalog,
}: {
  content: string;
  productCatalog: Product[];
}) {
  const productLinkPattern =
    /(\[[^\]]+\]\(\/container\/products\/[^)\s]+\)|\/container\/products\/[A-Za-z0-9-]+)/g;
  const parts = content.split(productLinkPattern);
  const mentionedProducts = productCatalog
    .filter((product) => content.includes(product.name))
    .sort(
      (left, right) =>
        content.indexOf(left.name) - content.indexOf(right.name),
    );

  return parts.map((part, index) => {
    const markdownMatch = part.match(
      /^\[([^\]]+)\]\((\/container\/products\/[^)\s]+)\)$/,
    );
    if (markdownMatch) {
      const matchedProduct = productCatalog.find(
        (product) =>
          markdownMatch[1].includes(product.name) ||
          product.name.includes(markdownMatch[1]),
      );
      return (
        <ProductMessageLink
          key={`${markdownMatch[2]}-${index}`}
          href={
            matchedProduct
              ? `/container/products/${matchedProduct.id}`
              : markdownMatch[2]
          }
          label={compactProductTitle(
            matchedProduct?.name || markdownMatch[1],
          )}
        />
      );
    }

    if (/^\/container\/products\/[A-Za-z0-9-]+$/.test(part)) {
      const productId = part.split("/").pop() ?? "";
      const currentProduct = productCatalog.find(
        (product) => product.id === productId,
      );
      const linkPosition = parts
        .slice(0, index)
        .filter((item) =>
          /^\/container\/products\/[A-Za-z0-9-]+$/.test(item),
        ).length;
      const product = currentProduct || mentionedProducts[linkPosition];
      return (
        <ProductMessageLink
          key={`${part}-${index}`}
          href={
            product ? `/container/products/${product.id}` : part
          }
          label={
            product ? compactProductTitle(product.name) : "商品详情"
          }
        />
      );
    }

    return <span key={`${index}-${part}`}>{part}</span>;
  });
}

function ProductMessageLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-[#9a6a2f] underline decoration-[#b88945] decoration-1 underline-offset-4 transition hover:text-[#714719]"
    >
      {label}
    </Link>
  );
}

function compactProductTitle(title: string) {
  const normalized = title
    .replace(/[（(].*?[）)]/g, "")
    .replace(/\s+/g, "")
    .trim();

  if (normalized.length <= 4) {
    return normalized || "商品详情";
  }
  return normalized.slice(0, 4);
}
