"use client";
import dynamic from "next/dynamic";
import { PaperClipOutlined } from "@ant-design/icons";
import { ApiOutlined, LinkOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Switch, theme } from "antd";
import React, { useState } from "react";
import Title from "antd/es/skeleton/Title";
// 动态导入 Sender，禁用 SSR
const Sender = dynamic(
  () => import("@ant-design/x").then((mod) => mod.Sender),
  { ssr: false }
);

const ChatPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setValue("");
        console.log("Send message successfully!");
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);
  return (
    <div
      className="flex justify-center items-center w-50"
      style={{ width: "40%" }}
    >
      <div className="text-[20px] text-[#ff0000]">小懒</div>
      <Sender
        onSubmit={() => {
          setLoading(true);
        }}
        onCancel={() => {
          setLoading(false);
        }}
        suffix={false}
        value={value}
        onChange={setValue}
        autoSize={{ minRows: 2, maxRows: 6 }}
        placeholder="向小懒提问"
        footer={(_, { components }) => {
          const { SendButton, LoadingButton, SpeechButton } = components;
          return (
            <Flex justify="space-between" align="center">
              <Flex gap="small" align="center">
                <Button
                  style={{ fontSize: 16 }}
                  type="text"
                  icon={<LinkOutlined />}
                />
              </Flex>
              <Flex align="center">
                <SpeechButton style={{ fontSize: 16 }} />
                <Divider orientation="vertical" />
                {loading ? (
                  <LoadingButton type="default" />
                ) : (
                  <SendButton type="primary" disabled={false} />
                )}
              </Flex>
            </Flex>
          );
        }}
      />
    </div>
  );
};

export default ChatPage;
