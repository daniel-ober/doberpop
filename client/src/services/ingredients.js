import axios from './api-config';

const getAllIngredients = async () => {
    const resp = api.get('/ingredients');
    return resp.data
}

const addIngredient = async (recipeId, ingredientId) => {
    const resp = api.post(`/recipes/${recipeId}/ingredients/${ingredientId}`);
    return resp.data;
}
