import React from "react";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }) {
  const {
    name,
    description,
    kernel_type,
    yield: yieldCount,
    ingredients = [],
  } = recipe;

  return (
    <div className="recipeCard">
      {/* Header row */}
      <div className="recipeCard__header">
        <h3 className="recipeCard__title">{name}</h3>

        {kernel_type && (
          <span className="recipeCard__kernel">
            {kernel_type}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="recipeCard__description">
          {description}
        </p>
      )}

      {/* Yield */}
      {yieldCount && (
        <div className="recipeCard__yield">
          Yield: {yieldCount}
        </div>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <div className="recipeCard__ingredients">
          {ingredients.map((ing) => (
            <span key={ing.id} className="ingredientChip">
              {ing.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}