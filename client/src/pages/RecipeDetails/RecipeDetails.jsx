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
    const url = mod && mod.default ? mod.default : mod;

    map[normalizeFlavorKey(base)] = url;
  });
  return map;
})();

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  // Like state (simple/local-first; you can wire to API later)
  const likeKey = useMemo(() => `doberpop_like_recipe_${id}`, [id]);
  const [liked, setLiked] = useState(() => {
    try {
      return localStorage.getItem(likeKey) === "1";
    } catch {
      return false;
    }
  });

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

  useEffect(() => {
    try {
      localStorage.setItem(likeKey, liked ? "1" : "0");
    } catch {}
  }, [liked, likeKey]);

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

  const shareText = useMemo(() => {
    if (!recipe) return "";
    const bits = [];
    if (recipe.name) bits.push(`🍿 ${recipe.name}`);
    if (recipe.kernel_type) bits.push(`Kernel: ${recipe.kernel_type}`);
    if (recipe.yield) bits.push(`Yield: ${recipe.yield} cups`);
    if (recipe.description) bits.push(`\n${recipe.description}`);
    bits.push(`\n${window.location.href}`);
    return bits.join(" • ");
  }, [recipe]);

  const handleShare = async () => {
    // Best available: native share sheet on mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.name || "Doberpop Recipe",
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // user canceled -> ignore
      }
    }

    // Fallback: open share chooser (FB), and copy link/text
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {}

    // FB sharer supports URL only (text prefill is not reliably supported anymore)
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(fb, "_blank", "noopener,noreferrer,width=900,height=700");
  };

  if (error) {
    return (
      <div className="page">
        <div className="detailsPage">
          <div className="empty">
            <div className="empty__title">Something went wrong</div>
            <div className="empty__text">{error}</div>
            <Link className="detailsBack" to="/recipes">
              ← Back to recipes
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
        <div className="detailsHeader">
          <div className="detailsHeaderLeft">
            <Link className="detailsBack" to="/recipes">
              ← Back to recipes
            </Link>

            <h1 className="detailsTitle">{recipe?.name || "Untitled"}</h1>

            <div className="detailsMeta">
              {recipe?.kernel_type ? `Kernel: ${recipe.kernel_type}` : "—"}
              {recipe?.yield ? ` • Yield: ${recipe.yield} cups` : ""}
            </div>
          </div>

          <div className="detailsHeaderRight">
            <button
              className={`detailsActionBtn ${liked ? "isLiked" : ""}`}
              onClick={() => setLiked((v) => !v)}
              type="button"
              aria-pressed={liked}
            >
              <span className="detailsActionIcon" aria-hidden>
                {liked ? "♥" : "♡"}
              </span>
              <span>{liked ? "Liked" : "Like"}</span>
            </button>

            <button
              className="detailsActionBtn"
              onClick={handleShare}
              type="button"
            >
              <span className="detailsActionIcon" aria-hidden>
                ↗
              </span>
              <span>Share</span>
            </button>
          </div>
        </div>

        {heroSrc ? (
          <div className="detailsHero">
            <img
              src={heroSrc}
              alt={`${recipe?.name || "Recipe"} hero`}
              onError={(e) => {
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

          <section className="detailsCard detailsCardFull">
            <div className="detailsLabel">Instructions</div>
            <pre className="detailsPre">{recipe?.instructions || "—"}</pre>
          </section>
        </div>

        {/* Optional: tiny helper text after sharing when clipboard works */}
        <div className="detailsFootnote">
          Tip: Share opens Facebook + copies the full recipe text/link to your
          clipboard (paste it into the post).
        </div>
      </div>
    </div>
  );
}