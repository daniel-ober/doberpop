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
  }, []);

  return (
    <div>
      <h2>{recipeItem?.name}</h2>
      <br />
      <br />
      Description:
      <br />
      {recipeItem?.description}
      <br />
      <br />
      Kernel Profile:
      <br />
      {recipeItem?.kernel_type}
      <br />
      <br />
      Ingredients:
      <br />
      <p>
        {recipeItem?.ingredients.reduce((acc, val, index) => {
          return `${index === 1 ? acc.name : acc}, ${val.name}`;
        })}
      </p>
      <br />
      <br />
      Yield (cups):
      <br />
      {recipeItem?.yield}
      <br />
      Instructions:
      <br />
      {recipeItem?.instructions}
    </div>
  );
}
