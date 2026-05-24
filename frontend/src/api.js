import axios from "axios";

const normalizeApiUrl = (url) => {
  const cleanUrl = url.replace(/\/+$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: normalizeApiUrl(import.meta.env.VITE_API_URL || "http://localhost:7070"),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Jika suatu saat pakai JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
