// client/src/services/auth.js
import api from "./api-config";

/**
 * Login
 * - Supports username OR email (identifier)
 * - Rails expects: { authentication: { identifier, password } }
 */
export const loginUser = async (loginData) => {
  const resp = await api.post("/auth/login", {
    authentication: {
      identifier: loginData.identifier,
      password: loginData.password,
    },
  });

  const { token, user } = resp.data;

  localStorage.setItem("authToken", token);
  api.defaults.headers.common.authorization = `Bearer ${token}`;

  return user;
};

export const registerUser = async (registerData) => {
  const resp = await api.post("/users/", {
    user: registerData,
  });

  const { token, user } = resp.data;

  localStorage.setItem("authToken", token);
  api.defaults.headers.common.authorization = `Bearer ${token}`;

  return user;
};

export const verifyUser = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) return null;

  api.defaults.headers.common.authorization = `Bearer ${token}`;

  try {
    const resp = await api.get("/auth/verify");
    return resp.data;
  } catch (err) {
    localStorage.removeItem("authToken");
    api.defaults.headers.common.authorization = null;
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
  api.defaults.headers.common.authorization = null;
};