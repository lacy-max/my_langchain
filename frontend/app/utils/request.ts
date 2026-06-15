// utils/request.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 定义响应数据的基础结构（根据你的后端实际响应格式调整）
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user_id?: string; // 登录接口返回的字段
  [key: string]: any;
}

class Request {
  private instance: AxiosInstance;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8000"
  ) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000, // 30秒超时
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 从 localStorage 获取 token / user_id 等（根据需要）
        const userId = localStorage.getItem("user_id");
        if (userId && config.headers) {
          config.headers["X-User-Id"] = userId;
        }
        // 如果你有 token，也可以类似处理
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        console.error("请求错误:", error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 如果你的后端统一返回 { success, data, message }，可以在这里做统一处理
        const res = response.data;
        if (res && res.success === false) {
          // 业务错误（如登录失败）
          const errorMsg = res.message || "请求失败";
          console.error("业务错误:", errorMsg);
          return Promise.reject(new Error(errorMsg));
        }
        return response;
      },
      (error) => {
        // 网络错误 / 超时 / 服务器错误
        let errorMsg = "网络错误";
        if (error.code === "ECONNABORTED") {
          errorMsg = "请求超时，请稍后重试";
        } else if (error.response) {
          const status = error.response.status;
          if (status === 401) errorMsg = "未授权，请重新登录";
          else if (status === 404) errorMsg = "请求的资源不存在";
          else if (status >= 500) errorMsg = "服务器错误，请稍后重试";
          else
            errorMsg = error.response.data?.message || `请求失败 (${status})`;
        } else if (error.request) {
          errorMsg = "无法连接到服务器，请检查网络";
        }
        console.error("响应错误:", errorMsg);
        // 可以在这里触发全局错误提示，比如使用 message.error(errorMsg)
        return Promise.reject(new Error(errorMsg));
      }
    );
  }

  // 封装 GET 请求
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config).then((res) => res.data);
  }

  // 封装 POST 请求
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config).then((res) => res.data);
  }

  // 封装 PUT 请求
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.put(url, data, config).then((res) => res.data);
  }

  // 封装 DELETE 请求
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config).then((res) => res.data);
  }

  // 如果你需要直接使用实例（例如上传文件），可以暴露原始实例
  getInstance() {
    return this.instance;
  }
}

// 导出单例
export default new Request();
