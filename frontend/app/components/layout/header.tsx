"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, MessageCircle } from "lucide-react";

const menus = [
  {
    title: "首页",
    href: "/container/home",
  },
  {
    title: "商品",
    href: "/container/products",
  },
  {
    title: "品牌故事",
    href: "/container/brand",
  },
  {
    title: "门店",
    href: "/container/stores",
  },
  {
    title: "招聘",
    href: "/container/jobs",
  },
];

function Header() {
  const pathname = usePathname();

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-20
        h-[76px]
        px-[72px]
        flex
        items-center
        justify-between
        bg-[#070604]/85
        backdrop-blur-xl
      "
    >
      {/* Logo */}
      <Link href="/">
        <div className="flex flex-col text-[#d8b56d] cursor-pointer">
          <strong className="text-[22px] tracking-[4px]">萃华珠宝</strong>

          <span className="text-[11px] tracking-[2px]">CUIHUA JEWELRY</span>
        </div>
      </Link>

      {/* Menu */}
      <nav className="flex gap-10 text-[15px] tracking-[2px]">
        {menus.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                relative
                transition-all
                duration-300
                ${active ? "text-[#d8b56d]" : "text-[#e8d8b8]"}
              `}
            >
              {item.title}

              <span
                className={`
                  absolute
                  left-0
                  -bottom-2
                  h-[1px]
                  bg-[#d8b56d]
                  transition-all
                  duration-300
                  ${active ? "w-full" : "w-0 group-hover:w-full"}
                `}
              />
            </Link>
          );
        })}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-6">
        <Link href="/ai-chat">
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-[#d8b56d]/40
              px-4
              py-2
              text-[#d8b56d]
              hover:bg-[#d8b56d]/10
              transition
            "
          >
            <MessageCircle size={16} />
            <span className="text-sm">AI顾问</span>
          </div>
        </Link>

        <Search
          size={18}
          className="
            text-[#e8d8b8]
            cursor-pointer
            hover:text-[#d8b56d]
            transition
          "
        />

        <User
          size={18}
          className="
            text-[#e8d8b8]
            cursor-pointer
            hover:text-[#d8b56d]
            transition
          "
        />
      </div>
    </header>
  );
}

export default Header;
