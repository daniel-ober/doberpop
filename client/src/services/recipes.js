import api from "./api-config";

export const getRecipes = async () => {
  const res = await api.get("/recipes");
  return res.data;
};

export const getOneRecipe = async (id) => {
  const res = await api.get(`/recipes/${id}`);
  return res.data;
};

export const deleteRecipe = async (id) => {
  const res = await api.delete(`/recipes/${id}`);
  return res.data;
};