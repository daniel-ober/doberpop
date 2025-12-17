import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getOneRecipe } from "../services/recipes";

export default function RecipeDetails() {
  const [recipeItem, setRecipeItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    let alive = true;

    const fetchRecipeItem = async () => {
      try {
        setLoading(true);
        setError("");
        const recipeData = await getOneRecipe(id);
        if (!alive) return;
        setRecipeItem(recipeData);
      } catch (e) {
        if (!alive) return;
        setError("Couldn’t load this recipe. Try again.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchRecipeItem();
    return () => {
      alive = false;
    };
  }, [id]);

  const ingredientsText = useMemo(() => {
    const list = recipeItem?.ingredients || [];
    if (!Array.isArray(list) || list.length === 0) return "—";
    return list.map((i) => i?.name).filter(Boolean).join(", ");
  }, [recipeItem]);

  if (loading) {
    return (
      <div className="page">
        <div className="details">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--block" />
          <div className="skeleton skeleton--block" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty__title">Something went wrong</div>
          <div className="empty__text">{error}</div>
          <Link className="btn btn--ghost" to="/recipes">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="details">
        <div className="details__top">
          <h1 className="details__title">{recipeItem?.name || "Untitled"}</h1>
          <Link className="btn btn--ghost" to="/recipes">
            ← Back
          </Link>
        </div>

        <div className="details__grid">
          <section className="panel">
            <div className="panel__label">Description</div>
            <div className="panel__text">{recipeItem?.description || "—"}</div>
          </section>

          <section className="panel">
            <div className="panel__label">Kernel Profile</div>
            <div className="panel__text">{recipeItem?.kernel_type || "—"}</div>
          </section>

          <section className="panel panel--full">
            <div className="panel__label">Ingredients</div>
            <div className="panel__text">{ingredientsText}</div>
          </section>

          <section className="panel">
            <div className="panel__label">Yield (cups)</div>
            <div className="panel__text">{recipeItem?.yield ?? "—"}</div>
          </section>

          <section className="panel panel--full">
            <div className="panel__label">Instructions</div>
            <div className="panel__text panel__text--pre">
              {recipeItem?.instructions || "—"}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}