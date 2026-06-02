"use client";

import dynamic from "next/dynamic";
import {
  AntDesignOutlined,
  CopyOutlined,
  RedoOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { BubbleItemType, BubbleListProps } from "@ant-design/x";
import type { GetRef } from "antd";
import { Avatar, Divider, Flex } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Sender from "./components/Sender";
import Bubble from "./components/Bubble";

let id = 0;
const getKey = () => `bubble_${id++}`;

// 生成消息

export default function ChatPage() {
  const [value, setValue] = useState<{ role: string; content: string }>({
    role: "user",
    content: "",
  });
  // 初始消息

  // const handleSend = async () => {
  //   if (!inputValue.trim() || loading) return;

  //   const userMessage = inputValue.trim();
  //   // 添加用户消息
  //   setItems((prev) => [...prev, genItem(false, userMessage)]);
  //   setInputValue("");
  //   setLoading(true);

  //   // 模拟 AI 回复（可替换为真实 API 调用）
  //   setTimeout(() => {
  //     const aiContent = mockAIResponse(userMessage);
  //     setItems((prev) => [...prev, genItem(true, aiContent)]);
  //     setLoading(false);
  //   }, 800);
  // };
  const add = ({ role, content }: { role: string; content: string }) => {
    setValue({ role, content });
  };

  return (
    <Flex vertical style={{ height: "100vh", width: "100%" }} align="center">
      <div
        style={{
          flex: 1,
          width: "50%",
          minWidth: 300,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 消息列表区域（可滚动） */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          <Bubble value={value} />
        </div>

        {/* 输入框区域（固定在底部） */}
        <div style={{ padding: "12px 0 24px", borderTop: "1px solid #f0f0f0" }}>
          <Sender onAdd={add} />
        </div>
      </div>
    </Flex>
  );
}
