import api from './api-config';

export const getAllIngredients = async () => {
    const resp = await api.get('/ingredients');
    return resp.data
}

export const getIngredient = async (ingredientId) => {
    const resp = await api.get(`/ingredients/${ingredientId}`);
    return resp.data
}

export const addIngredient = async (recipeId, ingredientId) => {
    const resp = await api.post(`/recipes/${recipeId}/ingredients/${ingredientId}`);
    return resp.data;
}
