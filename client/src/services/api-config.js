// client/src/services/api-config.js
import axios from "axios";

/**
 * Centralized API client
 * - Rails API runs on :3000
 * - React client runs on :3001
 * - Base URL comes from env, with safe fallback
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Attach JWT token (if present) to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // use lowercase 'authorization' (axios normalizes but this keeps it consistent everywhere)
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Global response handling
 * - Warn on unauthorized (expired / invalid token)
 * - Let calling code handle the error
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized API response (401)");
      // optional future hook:
      // localStorage.removeItem("authToken");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;