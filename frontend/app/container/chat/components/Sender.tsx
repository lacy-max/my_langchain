"use client";
import dynamic from "next/dynamic";
import { LinkOutlined } from "@ant-design/icons";
import { Button, Divider, Flex } from "antd";
import React, { useState } from "react";
import { chat_message } from "@/app/api/chat";
// 动态导入 Sender，禁用 SSR
const Sender = dynamic(
  () => import("@ant-design/x").then((mod) => mod.Sender),
  { ssr: false }
);

const ChatPage = ({
  onAdd,
}: {
  onAdd: (value: { role: string; content: string }) => void;
}) => {
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
    <Sender
      onSubmit={async () => {
        setLoading(true);
        console.log(value, "ddds");
        if (value.trim() !== "") {
          onAdd({
            role: "user",
            content: value,
          });
        }
        const res = await chat_message({
          message: value,
          session_id: "123",
        });
        const aiReply = res.data?.reply || res.reply; // 根据实际结构调整
        if (aiReply) {
          // 添加用户消息（已经在输入框显示，可能需要额外添加？根据 onAdd 逻辑）
          // 通常 onAdd 用于添加 AI 回复，用户消息可能已经由输入组件处理
          onAdd({
            role: "ai",
            content: aiReply,
          }); // 假设 onAdd 是添加 AI 回复到消息列表
        }
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
  );
};

export default ChatPage;
