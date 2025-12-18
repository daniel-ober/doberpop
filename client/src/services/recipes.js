import api from "./api-config";

/**
 * PUBLIC recipes (logged-in users & admins)
 * Rails routes live under /api/recipes
 */

export const getRecipes = async () => {
  const res = await api.get("/api/recipes");
  return res.data;
};

export const getOneRecipe = async (id) => {
  const res = await api.get(`/api/recipes/${id}`);
  return res.data;
};

export const deleteRecipe = async (id) => {
  const res = await api.delete(`/api/recipes/${id}`);
  return res.data;
};