"use client";

import { LogoutOutlined, ShoppingOutlined } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { App, Dropdown } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.replace("/container/login");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <ProLayout
      title="商品管理后台"
      logo={<ShoppingOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
      layout="mix"
      fixSiderbar
      location={{ pathname }}
      route={{
        path: "/",
        routes: [
          {
            path: "/container/products",
            name: "商品管理",
            icon: <ShoppingOutlined />,
          },
        ],
      }}
      menuItemRender={(item, dom) => {
        if (item.path) {
          return <Link href={item.path}>{dom}</Link>;
        }
        return dom;
      }}
      avatarProps={{
        title: "Admin",
        render: (_, dom) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "退出登录",
                  onClick: () => {
                    localStorage.removeItem("user_id");
                    message.success("已退出登录");
                    router.push("/container/login");
                  },
                },
              ],
            }}
          >
            {dom}
          </Dropdown>
        ),
      }}
    >
      <div style={{ padding: 24, minHeight: "calc(100vh - 120px)" }}>
        {children}
      </div>
    </ProLayout>
  );
}
