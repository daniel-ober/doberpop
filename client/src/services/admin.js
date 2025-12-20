// client/src/services/admin.js

// Use the same base URL logic everywhere:
// - In production: Netlify env REACT_APP_API_BASE_URL (e.g. https://doberpop-api.onrender.com)
// - In dev: fallback to http://localhost:3000
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

function authHeaders() {
  const token = localStorage.getItem("authToken"); // FIXED KEY
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getAdminUsers() {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    let errBody;
    try {
      errBody = await res.json();
    } catch {
      errBody = {};
    }
    throw new Error(errBody.error || errBody.errors || "Failed to fetch users");
  }

  return res.json();
}

export async function getAdminRecipes() {
  const res = await fetch(`${API_BASE}/api/admin/recipes`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    let errBody;
    try {
      errBody = await res.json();
    } catch {
      errBody = {};
    }
    throw new Error(
      errBody.error || errBody.errors || "Failed to fetch recipes"
    );
  }

  return res.json();
}

export async function deleteAdminUser(id) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    let errBody;
    try {
      errBody = await res.json();
    } catch {
      errBody = {};
    }
    throw new Error(errBody.error || errBody.errors || "Failed to delete user");
  }
}

export async function deleteAdminRecipe(id) {
  const res = await fetch(`${API_BASE}/api/admin/recipes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    let errBody;
    try {
      errBody = await res.json();
    } catch {
      errBody = {};
    }
    throw new Error(
      errBody.error || errBody.errors || "Failed to delete recipe"
    );
  }
}