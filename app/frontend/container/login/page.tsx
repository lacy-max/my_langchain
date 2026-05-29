"use client";
import { UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import { theme } from "antd";
export default function LoginPage() {
  const { token } = theme.useToken();

  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{ backgroundColor: token.colorBgContainer, minHeight: "100vh" }}
        className=" flex justify-center items-center"
      >
        <LoginForm
          title={
            <span style={{ color: "#ff6b6b", marginTop: 24 }}>
              🤖 智能客服助手
            </span>
          }
          onFinish={async (values) => {
            const { username, password } = values;
            const res = await fetch("/api/v1/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            console.log(data);

            // if (data.success) {
            //   localStorage.setItem("user_id", data.user_id);
            //   // 跳转到聊天页面
            // } else {
            //   alert(data.message);
            // }
          }}
          className="text-black"
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={"prefixIcon"} />,
            }}
            placeholder={"请输入用户名"}
            rules={[
              {
                required: true,
                message: "请输入用户名!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
}
