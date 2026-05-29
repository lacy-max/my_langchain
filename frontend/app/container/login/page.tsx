"use client";
import { auth_login } from "@/app/api/login";
import { UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import { message, theme } from "antd";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  return (
    <ProConfigProvider hashed={false}>
      {contextHolder}
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
            const res = await auth_login({ username, password });
            console.log(res, "eeee");
            if (res.success) {
              localStorage.setItem("user_id", res.user_id);
              messageApi.success("登录成功");
              router.push("/container/chat");

              // 跳转到聊天页面
            } else {
              alert(res.message);
            }
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
