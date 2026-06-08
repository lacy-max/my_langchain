import request from "@/lib/request";

export const authLogin = (data: { username: string; password: string }) =>
  request.post<{ success: boolean; message: string; user_id: string }>("/api/v1/login", data);
