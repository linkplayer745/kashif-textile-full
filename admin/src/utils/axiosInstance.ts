"use client";

import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Request Interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    if (
      error.response?.status === 401 &&
      (message === "TokenExpired" ||
        message === "InvalidToken" ||
        message === "Authorization header missing or malformed")
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
