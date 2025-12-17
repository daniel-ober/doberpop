import api from "./api-config";

export const getIngredients = async () => {
  const res = await api.get("/ingredients");
  return res.data;
};
