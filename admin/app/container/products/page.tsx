"use client";

import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/api/products";
import { PRODUCT_CATEGORIES, type Product } from "@/types/product";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { App, Button, Image, Popconfirm, Space, Tag } from "antd";
import { useRef, useState } from "react";

const categoryColors: Record<string, string> = {
  黄金系列: "gold",
  钻石系列: "blue",
  翡翠系列: "green",
  婚嫁系列: "magenta",
};

export default function ProductsPage() {
  const actionRef = useRef<ActionType>(null);
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success("删除成功");
      actionRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "删除失败");
    }
  };

  const columns: ProColumns<Product>[] = [
    // {
    //   title: "商品图片",
    //   dataIndex: "image",
    //   search: false,
    //   width: 100,
    //   render: (_, record) =>
    //     record.image ? (
    //       <Image src={record.image} alt={record.name} width={60} height={60} style={{ objectFit: "cover" }} />
    //     ) : (
    //       "-"
    //     ),
    // },
    {
      title: "商品名称",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "价格 (¥)",
      dataIndex: "price",
      search: false,
      width: 120,
      render: (_, record) => record.price.toLocaleString(),
    },
    {
      title: "系列",
      dataIndex: "category",
      valueType: "select",
      valueEnum: Object.fromEntries(
        PRODUCT_CATEGORIES.map((c) => [c, { text: c }])
      ),
      render: (_, record) => (
        <Tag color={categoryColors[record.category] || "default"}>
          {record.category}
        </Tag>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      search: false,
      ellipsis: true,
      width: 200,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      search: false,
      width: 180,
      render: (_, record) =>
        new Date(record.created_at).toLocaleString("zh-CN"),
    },
    {
      title: "操作",
      valueType: "option",
      width: 160,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setEditingProduct(record);
              setModalOpen(true);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除该商品？"
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
      <ProTable<Product>
        headerTitle="商品列表"
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
              setEditingProduct(null);
              setModalOpen(true);
            }}
          >
            新建商品
          </Button>,
        ]}
        request={async (params) => {
          try {
            const res = await fetchProducts({
              page: params.current || 1,
              page_size: params.pageSize || 10,
              keyword: params.name as string | undefined,
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

      <ModalForm
        title={editingProduct ? "编辑商品" : "新建商品"}
        open={modalOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setModalOpen(false);
            setEditingProduct(null);
          },
        }}
        initialValues={
          editingProduct
            ? {
                name: editingProduct.name,
                price: editingProduct.price,
                image: editingProduct.image,
                category: editingProduct.category,
                description: editingProduct.description,
              }
            : { category: PRODUCT_CATEGORIES[0] }
        }
        onFinish={async (values) => {
          try {
            if (editingProduct) {
              await updateProduct(editingProduct.id, values);
              message.success("更新成功");
            } else {
              await createProduct(values);
              message.success("创建成功");
            }
            setModalOpen(false);
            setEditingProduct(null);
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
          label="商品名称"
          rules={[{ required: true, message: "请输入商品名称" }]}
        />
        <ProFormDigit
          name="price"
          label="价格 (¥)"
          min={0.01}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: "请输入价格" }]}
        />
        <ProFormSelect
          name="category"
          label="系列"
          options={PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }))}
          rules={[{ required: true, message: "请选择系列" }]}
        />
        <ProFormText
          name="image"
          label="图片地址"
          placeholder="如 /images/gold.jpg"
        />
        <ProFormTextArea
          name="description"
          label="商品描述"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>
    </>
  );
}
