import request from "@/app/utils/request";
import type { Product } from "@/app/types/product";

interface ProductListResponse {
  success: boolean;
  data: Product[];
  total: number;
}

export const fetchProducts = (params: {
  page: number;
  page_size: number;
  category?: string;
  keyword?: string;
}) => request.get<ProductListResponse>("/api/v1/products", { params });
