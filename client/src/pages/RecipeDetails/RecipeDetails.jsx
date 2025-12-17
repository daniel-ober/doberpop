import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOneRecipe } from "../../services/recipes";
import "./RecipeDetails.css";

// Load all flavor images from src/assets/images/flavors (including nested folders)
const flavorCtx = require.context(
  "../../assets/images/flavors",
  true,
  /\.(png|jpe?g|webp)$/i
);

function normalizeFlavorKey(str) {
  return (str || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "");
}

// Build a map: "COOKIES & CREAM" -> imageUrl
const FLAVOR_HERO_MAP = (() => {
  const map = {};
  flavorCtx.keys().forEach((k) => {
    if (k.toLowerCase().includes("/additional/")) return;

    const filename = k.split("/").pop() || "";
    const base = filename.replace(/\.(png|jpe?g|webp)$/i, "");

    const mod = flavorCtx(k);
    const url = (mod && mod.default) ? mod.default : mod; // ✅ THIS is the fix

    map[normalizeFlavorKey(base)] = url;
  });
  return map;
})();

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const fetchRecipe = async () => {
      try {
        setError("");
        const data = await getOneRecipe(id);
        if (!alive) return;
        setRecipe(data);
      } catch (e) {
        if (!alive) return;
        setError("Couldn’t load this recipe. Try again.");
      }
    };

    fetchRecipe();
    return () => {
      alive = false;
    };
  }, [id]);

  const heroSrc = useMemo(() => {
    if (!recipe) return "";

    const v = recipe.hero_image_url;

    // If DB has a real URL or public path, use it.
    if (typeof v === "string" && (v.startsWith("http") || v.startsWith("/"))) {
      return v;
    }

    // Otherwise map by recipe name -> image filename
    const key = normalizeFlavorKey(recipe.name);
    return FLAVOR_HERO_MAP[key] || "";
  }, [recipe]);

  if (error) {
    return (
      <div className="page">
        <div className="detailsPage">
          <div className="empty">
            <div className="empty__title">Something went wrong</div>
            <div className="empty__text">{error}</div>
            <Link className="btn btn--ghost" to="/recipes">
              Back to recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="page">
        <div className="detailsPage">
          <div className="empty">
            <div className="empty__title">Loading…</div>
            <div className="empty__text">Fetching recipe details.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="detailsPage">
        <div className="detailsTop">
          <div>
            <h1 className="detailsTitle">{recipe?.name || "Untitled"}</h1>
            <div className="detailsSub">
              {recipe?.kernel_type ? `Kernel: ${recipe.kernel_type}` : "—"}
              {recipe?.yield ? ` • Yield: ${recipe.yield} cups` : ""}
            </div>
          </div>

          <Link className="btn btn--ghost" to="/recipes">
            ← Back
          </Link>
        </div>

        {heroSrc ? (
          <div className="detailsHero">
            <img
              src={heroSrc}
              alt={`${recipe?.name || "Recipe"} hero`}
              onError={(e) => {
                // if it still fails, hide the broken image box
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : null}

        <div className="detailsGrid">
          <section className="detailsCard">
            <div className="detailsLabel">Description</div>
            <div className="detailsText">{recipe?.description || "—"}</div>
          </section>

          <section className="detailsCard">
            <div className="detailsLabel">Ingredients</div>
            {Array.isArray(recipe?.ingredients) && recipe.ingredients.length ? (
              <ul className="detailsList">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id || ing.name}>{ing.name}</li>
                ))}
              </ul>
            ) : (
              <div className="detailsText">—</div>
            )}
          </section>

          <section className="detailsCard" style={{ gridColumn: "1 / -1" }}>
            <div className="detailsLabel">Instructions</div>
            <pre className="detailsPre">{recipe?.instructions || "—"}</pre>
          </section>
        </div>
      </div>
    </div>
  );
}