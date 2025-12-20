// client/src/services/auth.js

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const TOKEN_KEY = "authToken";

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// helper to shape errors so Login.jsx's extractAuthError() can read status
async function buildError(res) {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  const err = new Error(data?.error || "Request failed");
  err.response = {
    status: res.status,
    data,
  };
  return err;
}

/**
 * LOGIN
 * POST /auth/login
 * body: { identifier, password }
 * response: { user: {...}, token: "..." }
 */
export const loginUser = async ({ identifier, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    throw await buildError(res);
  }

  const data = await res.json();
  setToken(data.token);
  return data.user;
};

/**
 * REGISTER
 * POST /auth/register
 * body: { user: { username, email, password } }
 */
export const registerUser = async ({ username, email, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: { username, email, password },
    }),
  });

  if (!res.ok) {
    throw await buildError(res);
  }

  const data = await res.json();
  return data.user;
};

/**
 * VERIFY
 * GET /auth/verify
 * headers: Authorization: Bearer <token>
 */
export const verifyUser = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token");
  }

  const res = await fetch(`${API_BASE_URL}/auth/verify`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw await buildError(res);
  }

  const data = await res.json();
  return data.user;
};