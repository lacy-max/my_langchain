import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

class Request {
  private instance: AxiosInstance;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  ) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const userId = localStorage.getItem("user_id");
        if (userId && config.headers) {
          config.headers["X-User-Id"] = userId;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        let errorMsg = "网络错误";
        if (error.response) {
          const status = error.response.status;
          if (status === 401) errorMsg = "未授权，请重新登录";
          else errorMsg = error.response.data?.detail || error.response.data?.message || `请求失败 (${status})`;
        }
        return Promise.reject(new Error(errorMsg));
      }
    );
  }

  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config).then((res) => res.data);
  }

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config).then((res) => res.data);
  }

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config).then((res) => res.data);
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config).then((res) => res.data);
  }
}

export default new Request();
