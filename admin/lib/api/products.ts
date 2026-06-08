import request from "@/lib/request";
import type { Product, ProductFormValues } from "@/types/product";

interface ListResponse {
  success: boolean;
  data: Product[];
  total: number;
}

interface ItemResponse {
  success: boolean;
  data: Product;
  message?: string;
}

export const fetchProducts = (params: { page: number; page_size: number; keyword?: string }) =>
  request.get<ListResponse>("/api/v1/products", { params });

export const fetchProduct = (id: string) =>
  request.get<ItemResponse>(`/api/v1/products/${id}`);

export const createProduct = (data: ProductFormValues) =>
  request.post<ItemResponse>("/api/v1/products", data);

export const updateProduct = (id: string, data: Partial<ProductFormValues>) =>
  request.put<ItemResponse>(`/api/v1/products/${id}`, data);

export const deleteProduct = (id: string) =>
  request.delete<{ success: boolean; message: string }>(`/api/v1/products/${id}`);
