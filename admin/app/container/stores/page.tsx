"use client";

import {
  createStore,
  deleteStore,
  fetchStores,
  updateStore,
} from "@/lib/api/stores";
import { STORE_LEVELS, type Store } from "@/types/store";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { App, Button, Popconfirm, Space, Tag } from "antd";
import { useRef, useState } from "react";

type StoreFormFields = Omit<Store, "id" | "created_at" | "updated_at" | "services"> & {
  servicesText?: string;
};

const levelColors: Record<string, string> = {
  旗舰店: "gold",
  精品店: "blue",
  专柜: "green",
};

function splitServices(value?: string) {
  return (value || "")
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function StoresPage() {
  const actionRef = useRef<ActionType>(null);
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteStore(id);
      message.success("删除成功");
      actionRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "删除失败");
    }
  };

  const columns: ProColumns<Store>[] = [
    {
      title: "门店名称",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "城市",
      dataIndex: "city",
      width: 110,
    },
    {
      title: "门店类型",
      dataIndex: "level",
      valueType: "select",
      width: 120,
      valueEnum: Object.fromEntries(STORE_LEVELS.map((level) => [level, { text: level }])),
      render: (_, record) => (
        <Tag color={levelColors[record.level] || "default"}>{record.level}</Tag>
      ),
    },
    {
      title: "地址",
      dataIndex: "address",
      search: false,
      ellipsis: true,
    },
    {
      title: "电话",
      dataIndex: "phone",
      search: false,
      width: 150,
    },
    {
      title: "营业时间",
      dataIndex: "hours",
      search: false,
      width: 150,
    },
    {
      title: "服务",
      dataIndex: "services",
      search: false,
      width: 220,
      render: (_, record) => (
        <Space size={[0, 6]} wrap>
          {record.services.map((service) => (
            <Tag key={service}>{service}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "操作",
      valueType: "option",
      width: 160,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setEditingStore(record);
              setModalOpen(true);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除该门店？"
            onConfirm={() => handleDelete(record.id)}
          >
            <a style={{ color: "#ff4d4f" }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<Store>
        headerTitle="门店列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{ labelWidth: "auto" }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingStore(null);
              setModalOpen(true);
            }}
          >
            新建门店
          </Button>,
        ]}
        request={async (params) => {
          try {
            const res = await fetchStores({
              page: params.current || 1,
              page_size: params.pageSize || 10,
              keyword: params.name as string | undefined,
              city: params.city as string | undefined,
            });
            return {
              data: res.data,
              total: res.total,
              success: true,
            };
          } catch (err) {
            message.error(err instanceof Error ? err.message : "加载失败");
            return { data: [], total: 0, success: false };
          }
        }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
      />

      <ModalForm<StoreFormFields>
        title={editingStore ? "编辑门店" : "新建门店"}
        open={modalOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setModalOpen(false);
            setEditingStore(null);
          },
        }}
        initialValues={
          editingStore
            ? {
                city: editingStore.city,
                name: editingStore.name,
                address: editingStore.address,
                phone: editingStore.phone,
                hours: editingStore.hours,
                level: editingStore.level,
                distance: editingStore.distance,
                servicesText: editingStore.services.join("，"),
              }
            : { level: STORE_LEVELS[0], hours: "10:00 - 22:00" }
        }
        onFinish={async (values) => {
          const payload = {
            city: values.city,
            name: values.name,
            address: values.address,
            phone: values.phone,
            hours: values.hours,
            level: values.level,
            distance: values.distance || "",
            services: splitServices(values.servicesText),
          };

          try {
            if (editingStore) {
              await updateStore(editingStore.id, payload);
              message.success("更新成功");
            } else {
              await createStore(payload);
              message.success("创建成功");
            }
            setModalOpen(false);
            setEditingStore(null);
            actionRef.current?.reload();
            return true;
          } catch (err) {
            message.error(err instanceof Error ? err.message : "操作失败");
            return false;
          }
        }}
      >
        <ProFormText
          name="name"
          label="门店名称"
          rules={[{ required: true, message: "请输入门店名称" }]}
        />
        <ProFormText
          name="city"
          label="城市"
          rules={[{ required: true, message: "请输入城市" }]}
        />
        <ProFormSelect
          name="level"
          label="门店类型"
          options={STORE_LEVELS.map((level) => ({ label: level, value: level }))}
          rules={[{ required: true, message: "请选择门店类型" }]}
        />
        <ProFormText
          name="address"
          label="详细地址"
          rules={[{ required: true, message: "请输入详细地址" }]}
        />
        <ProFormText
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: "请输入联系电话" }]}
        />
        <ProFormText
          name="hours"
          label="营业时间"
          placeholder="如 10:00 - 22:00"
          rules={[{ required: true, message: "请输入营业时间" }]}
        />
        <ProFormText
          name="distance"
          label="距离/商圈"
          placeholder="如 距您约 2.4km 或 热门商圈"
        />
        <ProFormTextArea
          name="servicesText"
          label="门店服务"
          placeholder="多个服务用逗号或换行分隔，如 婚嫁定制，黄金换新，珠宝保养"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>
    </>
  );
}
