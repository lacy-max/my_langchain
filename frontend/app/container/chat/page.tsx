"use client";
import { Flex } from "antd";
import React, { useState } from "react";
import Sender from "./components/Sender";
import Bubble from "./components/Bubble";

let id = 0;

// 生成消息

export default function ChatPage() {
  const [value, setValue] = useState<{ role: string; content: string }>({
    role: "user",
    content: "",
  });
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
