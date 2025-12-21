// client/src/services/auth.js
import api from "./api-config";

const TOKEN_KEY = "authToken";

/**
 * Token helpers
 */
export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.authorization;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  setToken(null);
}

// On initial load, if a token exists in localStorage, attach it to axios
const existingToken = getToken();
if (existingToken) {
  api.defaults.headers.common.authorization = `Bearer ${existingToken}`;
}

/**
 * LOGIN
 * Expects backend: POST /auth/login
 * Response shape: { user: {...}, token: "..." }
 */
export async function loginUser(credentials) {
  const payload = {
    identifier: credentials.identifier,
    password: credentials.password,
  };

  const res = await api.post("/auth/login", payload);
  const { user, token } = res.data || {};

  if (token) setToken(token);

  return user || null;
}

/**
 * REGISTER
 * Expects backend: POST /auth/register
 * Response shape: { user: {...}, token: "..." }
 */
export async function registerUser(data) {
  const payload = {
    user: {
      username: data.username,
      email: data.email,
      password: data.password,
    },
  };

  const res = await api.post("/auth/register", payload);
  const { user, token } = res.data || {};

  if (token) setToken(token);

  return user || null;
}

/**
 * VERIFY
 * Expects backend: GET /auth/verify
 * Response shape: { user: {...} }
 */
export async function verifyUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await api.get("/auth/verify");
    return res.data?.user || null;
  } catch {
    removeToken();
    return null;
  }
}

/**
 * ACCOUNT UPDATE
 * Expects backend: PATCH /auth/account
 * Request body can contain:
 *  - username
 *  - email
 *  - current_password (required if changing password)
 *  - new_password    (optional)
 *
 * Response shape: { user: {...} }
 */
export async function updateAccount(payload) {
  const res = await api.patch("/auth/account", payload);
  // We don't expect a new token here, just updated user
  return res.data;
}