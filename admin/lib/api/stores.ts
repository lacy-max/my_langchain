import request from "@/lib/request";
import type { Store, StoreFormValues } from "@/types/store";

interface ListResponse {
  success: boolean;
  data: Store[];
  total: number;
}

interface ItemResponse {
  success: boolean;
  data: Store;
  message?: string;
}

export const fetchStores = (params: {
  page: number;
  page_size: number;
  keyword?: string;
  city?: string;
}) => request.get<ListResponse>("/api/v1/stores", { params });

export const fetchStore = (id: string) =>
  request.get<ItemResponse>(`/api/v1/stores/${id}`);

export const createStore = (data: StoreFormValues) =>
  request.post<ItemResponse>("/api/v1/stores", data);

export const updateStore = (id: string, data: Partial<StoreFormValues>) =>
  request.put<ItemResponse>(`/api/v1/stores/${id}`, data);

export const deleteStore = (id: string) =>
  request.delete<{ success: boolean; message: string }>(`/api/v1/stores/${id}`);
