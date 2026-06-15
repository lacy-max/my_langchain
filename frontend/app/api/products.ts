import request from "@/app/utils/request";
import type { Product } from "@/app/types/product";

interface ProductListResponse {
  success: boolean;
  data: Product[];
  total: number;
}

interface ProductItemResponse {
  success: boolean;
  data: Product;
  message?: string;
}

export const fetchProducts = (params: {
  page: number;
  page_size: number;
  category?: string;
  keyword?: string;
}) => request.get<ProductListResponse>("/api/v1/products", { params });

export const fetchProduct = (productId: string) =>
  request.get<ProductItemResponse>(`/api/v1/products/${productId}`);
