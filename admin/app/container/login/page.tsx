"use client";

import { authLogin } from "@/lib/api/login";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import { App, theme } from "antd";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const router = useRouter();

  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoginForm
          title="商品管理后台"
          subTitle="React + Ant Design Pro"
          onFinish={async (values) => {
            const { username, password } = values;
            try {
              const res = await authLogin({ username: username, password });
              if (res.success) {
                localStorage.setItem("user_id", res.user_id);
                message.success("登录成功");
                router.push("/products");
              }
            } catch (err) {
              message.error(err instanceof Error ? err.message : "登录失败");
            }
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined />,
            }}
            placeholder="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined />,
            }}
            placeholder="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
}
