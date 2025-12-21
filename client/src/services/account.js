// client/src/services/account.js

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

function authHeaders() {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleAccountResponse(res, defaultErrorMessage) {
  let body;
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  if (!res.ok) {
    const message =
      body.error || body.errors || defaultErrorMessage || "Request failed";
    const err = new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
    err.status = res.status;
    throw err;
  }

  return body;
}

export async function getAccount() {
  const res = await fetch(`${API_BASE}/api/account`, {
    method: "GET",
    headers: authHeaders(),
  });

  return handleAccountResponse(res, "Failed to load account");
}

export async function updateAccount(payload) {
  const res = await fetch(`${API_BASE}/api/account`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  return handleAccountResponse(res, "Failed to update account");
}

// 🔥 Self-service account deletion
export async function deleteMyAccount() {
  const res = await fetch(`${API_BASE}/api/account`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handleAccountResponse(res, "Failed to delete account");
}