import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOneRecipe } from "../services/recipes";

export default function RecipeDetails() {
  const [recipeItem, setRecipeItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipeItem = async () => {
      const recipeData = await getOneRecipe(id);
      setRecipeItem(recipeData);
    };
    fetchRecipeItem();
  }, [id]);

  return (
    <div className="recipe-container">
      <h2>{recipeItem?.name}</h2>
      <div className="recipe-details">
        <p className="details-label">Description:</p>
        {recipeItem?.description}
        <p className="details-label">Kernel Profile:</p>
        {recipeItem?.kernel_type}
        <p className="details-label">Ingredients:</p>
        {recipeItem?.ingredients.reduce((acc, val, index) => {
          return `${index === 1 ? acc.name : acc}, ${val.name}`;
        })}
        <p className="details-label">Yield (cups):</p>
        {recipeItem?.yield}
        <p className="details-label">Instructions:</p>
        {recipeItem?.instructions}
      </div>
    </div>
  );
}
