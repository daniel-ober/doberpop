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

async function handleJsonResponse(res, defaultMessage) {
  if (!res.ok) {
    let errBody;
    try {
      errBody = await res.json();
    } catch {
      errBody = {};
    }
    throw new Error(errBody.error || errBody.errors || defaultMessage);
  }
  // If there is no content (204), don't try to parse JSON
  if (res.status === 204) return null;
  return res.json();
}

/* ================================
 * ADMIN USERS
 * ================================ */

export async function getAdminUsers() {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: authHeaders(),
  });
  return handleJsonResponse(res, "Failed to fetch users");
}

export async function deleteAdminUser(id) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleJsonResponse(res, "Failed to delete user");
}

/* ================================
 * ADMIN RECIPES
 * ================================ */

export async function getAdminRecipes() {
  const res = await fetch(`${API_BASE}/api/admin/recipes`, {
    headers: authHeaders(),
  });
  return handleJsonResponse(res, "Failed to fetch recipes");
}

export async function deleteAdminRecipe(id) {
  const res = await fetch(`${API_BASE}/api/admin/recipes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleJsonResponse(res, "Failed to delete recipe");
}

/**
 * Toggle / update sampler fields for a recipe from the admin dashboard.
 *
 * attrs can be:
 *   { show_in_sampler: true/false }
 *   or also include sampler_position later if you want ordering.
 */
export async function updateAdminRecipeSampler(id, attrs) {
  const res = await fetch(`${API_BASE}/api/admin/recipes/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(attrs),
  });
  return handleJsonResponse(res, "Failed to update sampler settings");
}