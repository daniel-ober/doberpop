// client/src/services/api-config.js
import axios from "axios";

/**
 * Centralized API client
 * - Rails API runs on :3000 locally
 * - React client runs on :3001 locally
 * - Production should use REACT_APP_API_BASE_URL
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized API response (401)");
    }

    return Promise.reject(error);
  }
);

export default api;