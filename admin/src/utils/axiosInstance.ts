import axios from "axios";
import router from "next/router";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    if (
      error.response?.status === 401 &&
      (message === "TokenExpired" || message === "InvalidToken")
    ) {
      localStorage.removeItem("token");
      router.push("/login");
    }

    return Promise.reject(error);
  },
);

export default api;
