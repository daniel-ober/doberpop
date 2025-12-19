import api from "./api-config";

// GET /api/favorites
export const getFavorites = async () => {
  const resp = await api.get("/api/favorites");
  return resp.data;
};

// POST /api/recipes/:recipe_id/favorite
export const favoriteRecipe = async (recipeId) => {
  const resp = await api.post(`/api/recipes/${recipeId}/favorite`);
  return resp.data;
};

// DELETE /api/recipes/:recipe_id/favorite
export const unfavoriteRecipe = async (recipeId) => {
  const resp = await api.delete(`/api/recipes/${recipeId}/favorite`);
  return resp.data;
};