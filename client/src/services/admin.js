const API_BASE = "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("authToken"); // FIXED KEY
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getAdminUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors || "Failed to fetch users");
  }

  return res.json();
}

export async function getAdminRecipes() {
  const res = await fetch(`${API_BASE}/admin/recipes`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors || "Failed to fetch recipes");
  }

  return res.json();
}

export async function deleteAdminUser(id) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors || "Failed to delete user");
  }
}

export async function deleteAdminRecipe(id) {
  const res = await fetch(`${API_BASE}/admin/recipes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors || "Failed to delete recipe");
  }
}