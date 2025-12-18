import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

/**
 * Attach token automatically on refresh / reload
 */
const token = localStorage.getItem("authToken");
if (token) {
  api.defaults.headers.common.authorization = `Bearer ${token}`;
}

/**
 * Optional: catch auth failures globally
 * (does NOT log out automatically — just prevents silent failures)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized API response (401)");
    }
    return Promise.reject(error);
  }
);

export default api;