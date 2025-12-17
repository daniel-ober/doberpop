import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOneRecipe } from "../../services/recipes";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await getOneRecipe(id);
      setRecipe(data);
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">{recipe.name}</h1>
          <p className="page__subtitle">
            {recipe.kernel_type ? `Kernel: ${recipe.kernel_type}` : "—"}
          </p>
        </div>

        <Link className="btn btn--ghost" to="/recipes">
          ← Back
        </Link>
      </div>

      <div className="card">
        <h3>Instructions</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {recipe.instructions || "No instructions yet."}
        </pre>

        {recipe.ingredients?.length ? (
          <>
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ing) => (
                <li key={ing.id}>{ing.name}</li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}