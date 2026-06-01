import {
  AntDesignOutlined,
  CopyOutlined,
  RedoOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { BubbleItemType, BubbleListProps } from "@ant-design/x";
import { Actions, Bubble } from "@ant-design/x";
import type { GetRef } from "antd";
import { Avatar, Button, Flex } from "antd";
import React, { useCallback, useEffect } from "react";

const actionItems = [
  {
    key: "retry",
    icon: <RedoOutlined />,
    label: "Retry",
  },
  {
    key: "copy",
    icon: <CopyOutlined />,
    label: "Copy",
  },
];

let id = 0;

const getKey = () => `bubble_${id++}`;

const genItem = (isAI: boolean, content: string): BubbleItemType => ({
  key: getKey(),
  role: isAI ? "ai" : "user",
  content,
});

function useBubbleList(initialItems: BubbleItemType[] = []) {
  const [items, setItems] = React.useState<BubbleItemType[]>(initialItems);

  const appendItem = useCallback((item: BubbleItemType) => {
    setItems((prev) => [...prev, item]);
  }, []);

  return [items, setItems, appendItem] as const;
}

const BubbleList = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [items, setItems, add] = useBubbleList();

  useEffect(() => {
    setItems([
      genItem(false, "你好，我想咨询一下退货政策。"),
      genItem(true, "您可以在订单页面申请退货，7天内无理由退货。"),
      genItem(false, "谢谢！那运费怎么算？"),
      genItem(true, "如果是质量问题，运费由我们承担；无理由退货需您承担运费。"),
    ]);
  }, []);
  // 自动滚动到底部
  const scrollToBottom = () => {
    if (listRef.current) {
      const listElement = listRef.current as any;
      const div = listElement?.nativeElement || listElement;
      if (div?.scrollTo) {
        div.scrollTo({ top: div.scrollHeight, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [items]);

  const roleConfig: BubbleListProps["role"] = {
    ai: {
      placement: "start",
      typing: {
        effect: "fade-in",
        step: 5,
        interval: 30,
      },
      header: "小懒",
      avatar: <Avatar icon={<AntDesignOutlined />} />,
      footer: (content) => (
        <Actions
          items={[
            { key: "copy", icon: <CopyOutlined />, label: "复制" },
            { key: "retry", icon: <RedoOutlined />, label: "重试" },
          ]}
          onClick={({ key }) => {
            if (key === "copy") {
              navigator.clipboard.writeText(content as string);
            }
            if (key === "retry") {
              console.log("重试", content);
            }
          }}
        />
      ),
    },
    user: {
      placement: "end",
      header: "我",
      avatar: <Avatar icon={<UserOutlined />} />,
      footer: (content) => (
        <Actions
          items={[{ key: "copy", icon: <CopyOutlined />, label: "复制" }]}
          onClick={({ key }) => {
            if (key === "copy") {
              navigator.clipboard.writeText(content as string);
            }
          }}
        />
      ),
    },
  };

  return <Bubble.List ref={listRef} role={roleConfig} items={items} />;
};

export default BubbleList;
