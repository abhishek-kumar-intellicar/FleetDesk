import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://dmt2.intellicar.io:11014/api/v1/",
  // timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(errorMessage));
  },
);

/** POST helper — interceptor already unwraps `response.data`. */
export function apiPost<T>(path: string, data?: unknown): Promise<T> {
  return axiosInstance.post(path, data) as Promise<T>;
}
