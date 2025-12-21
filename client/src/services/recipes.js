// client/src/services/recipes.js
import api from "./api-config";

/**
 * PUBLIC recipes (logged-in users & admins)
 * Rails routes live under /api/recipes
 */

/**
 * Core helper: fetch recipes + metadata from the API.
 * Always returns an object:
 *   { recipes: [...], totalSignatureCount: number | undefined }
 */
export const getRecipesWithMeta = async () => {
  const res = await api.get("/api/recipes");
  const data = res.data || {};

  const recipes = Array.isArray(data) ? data : data.recipes || [];
  const totalSignatureCount = data.total_signature_count;

  return { recipes, totalSignatureCount };
};

// ===== GET ALL RECIPES (backwards-compatible) =====
// Old callers that expect JUST an array can keep using this.
export const getRecipes = async () => {
  const { recipes } = await getRecipesWithMeta();
  return recipes;
};

// 👇 Backwards-compat alias for MainContainer
export const getAllRecipes = async () => {
  return getRecipes();
};

// ===== GET SAMPLER (optional helper) =====
// Explicit sampler list – useful for homepage carousels, etc.
export const getSamplerRecipes = async () => {
  const res = await api.get("/api/recipes", {
    params: { sampler: true },
  });

  const data = res.data || {};
  const recipes = Array.isArray(data) ? data : data.recipes || [];
  return recipes;
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