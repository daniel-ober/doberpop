// client/src/services/recipes.js
import api from "./api-config";

/**
 * PUBLIC recipes (logged-in users & admins)
 * Rails routes live under /api/recipes
 */

// ===== GET ALL RECIPES =====
export const getRecipes = async () => {
  const res = await api.get("/api/recipes");
  return res.data;
};

// 👇 Backwards-compat alias for MainContainer
export const getAllRecipes = async () => {
  return getRecipes();
};

// ===== GET SAMPLER (optional helper) =====
// Official sampler list – useful for homepage carousels, etc.
export const getSamplerRecipes = async () => {
  const res = await api.get("/api/recipes", {
    params: { sampler: true },
  });
  return res.data;
};

// ===== GET ONE =====
export const getOneRecipe = async (id) => {
  const res = await api.get(`/api/recipes/${id}`);
  return res.data;
};

// ===== CREATE =====
export const createRecipe = async (payload) => {
  const res = await api.post("/api/recipes", payload);
  return res.data;
};

// ===== UPDATE =====
export const updateRecipe = async (id, payload) => {
  const res = await api.put(`/api/recipes/${id}`, payload);
  return res.data;
};

// ===== DELETE =====
export const deleteRecipe = async (id) => {
  const res = await api.delete(`/api/recipes/${id}`);
  return res.data;
};