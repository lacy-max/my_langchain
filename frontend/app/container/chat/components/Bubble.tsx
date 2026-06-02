import {
  AntDesignOutlined,
  CopyOutlined,
  RedoOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { BubbleItemType, BubbleListProps } from "@ant-design/x";
import type { GetRef } from "antd";
import { Actions, Bubble } from "@ant-design/x";
import { Avatar } from "antd";
import React, { memo, useCallback, useEffect, useRef } from "react";

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

const BubbleList = ({
  value,
}: {
  value: { role: string; content: string };
}) => {
  // 1. 使用 Ant Design X 提供的 BubbleListRef 类型来获取 ref
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [items, setItems, appendItem] = useBubbleList();

  // 记录上一次的滚动高度，用于判断用户是否在底部
  const prevScrollHeight = useRef(0);

  // 智能滚动到底部的方法
  const scrollToBottom = () => {
    const listDom = listRef.current?.nativeElement;
    if (listDom) {
      // 使用 requestAnimationFrame 确保在 DOM 渲染完成后执行滚动
      requestAnimationFrame(() => {
        listDom.scrollTo({
          top: listDom.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  };

  // 初始化欢迎语
  useEffect(() => {
    setItems([
      genItem(
        true,
        "您好！我是小懒，很高兴为您服务。您可以向我咨询：\n- 退货政策\n- 发货时间\n- 会员权益\n- 或其他任何问题"
      ),
    ]);
  }, []);

  // 2. 监听 items 变化，实现智能自动滚动
  useEffect(() => {
    const listDom = listRef.current?.nativeElement;
    if (listDom) {
      // 计算当前滚动条距离底部的距离（留 30px 的误差容忍度）
      const isNearBottom =
        listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 30;

      // 只有当用户原本就在底部附近时，才自动滚动到最新消息
      // 如果用户正在往上翻看历史记录，则不打扰用户
      if (isNearBottom || prevScrollHeight.current === 0) {
        scrollToBottom();
      }
      // 更新上一次的滚动高度
      prevScrollHeight.current = listDom.scrollHeight;
    }
  }, [items]);

  // 监听外部传入的 value 变化，添加新消息
  useEffect(() => {
    if (value && value.content && value.content.trim() !== "") {
      appendItem(genItem(value.role === "user" ? false : true, value.content));
    }
  }, [value, appendItem]);

  const roleConfig: BubbleListProps["role"] = {
    ai: {
      placement: "start",
      typing: {
        effect: "fade-in",
        step: 5,
        interval: 30,
      },
      header: "小懒AI",
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

  return (
    // 3. 将 ref 正确绑定到 Bubble.List 上，并设置好容器高度和滚动属性
    <Bubble.List
      ref={listRef}
      role={roleConfig}
      items={items}
      style={{ height: "100%", overflowY: "auto" }}
    />
  );
};

export default memo(BubbleList);
