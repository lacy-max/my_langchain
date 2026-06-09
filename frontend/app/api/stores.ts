import request from "@/app/utils/request";
import type { Store } from "@/app/types/store";

interface StoreListResponse {
  success: boolean;
  data: Store[];
  total: number;
}

export const fetchStores = (params: {
  page: number;
  page_size: number;
  city?: string;
  keyword?: string;
}) => request.get<StoreListResponse>("/api/v1/stores", { params });
