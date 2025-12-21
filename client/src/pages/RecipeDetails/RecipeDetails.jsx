// client/src/pages/RecipeDetails/RecipeDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOneRecipe } from "../../services/recipes";
import {
  getFavorites,
  favoriteRecipe,
  unfavoriteRecipe,
} from "../../services/favorites";
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

/* =========================================================
   TOOLS / SUPPLIES PER RECIPE
   ========================================================= */

const BASE_POPCORN_TOOLS = [
  "Whirley-pop popcorn maker (or heavy-bottomed pot with lid)",
  "Large heatproof mixing bowl",
  "Measuring cups and spoons",
];

const SAVORY_TOOLS = [
  ...BASE_POPCORN_TOOLS,
  "Small saucepan or microwave-safe cup (for melting butter/oil)",
  "Heatproof spatula or wooden spoon",
  "Rimmed baking sheet lined with parchment (for KernelSet™ Cycle)",
];

const CANDY_COATED_TOOLS = [
  ...BASE_POPCORN_TOOLS,
  "Small saucepan (for sauces/caramel/toffee)",
  "Microwave-safe bowl or double boiler (for chocolate)",
  "Heatproof spatulas",
  "2 rimmed baking sheets lined with parchment (for KernelSet™ Cycle)",
];

const TOOLS_MAP = {
  // Candy / chocolate / glaze–style
  "Maple & Bourbon": [
    ...CANDY_COATED_TOOLS,
    "Whisk (for maple–bourbon glaze)",
  ],
  "Cookies & Cream": [
    ...CANDY_COATED_TOOLS,
    "Rolling pin or mallet (for crushing cookies)",
  ],
  "Birthday Cake": [
    ...CANDY_COATED_TOOLS,
    "Small bowl for sprinkles and cake mix",
  ],
  "English Toffee Candy (Holiday)": [
    ...CANDY_COATED_TOOLS,
    "Heavy-bottomed saucepan (for toffee)",
    "Candy thermometer (optional, for checking toffee temperature)",
  ],
  "Peppermint Cookie": [
    ...CANDY_COATED_TOOLS,
    "Rolling pin or mallet (for crushing cookies and peppermint candy)",
  ],
  "Salted Caramel": [
    ...CANDY_COATED_TOOLS,
    "Heatproof jug or cup for warming caramel sauce",
  ],
  "Salted Caramel & Dark Chocolate": [
    ...CANDY_COATED_TOOLS,
    "Piping bag or spoon for drizzling dark chocolate",
  ],
  "Peanut Butter CupCorn": [
    ...CANDY_COATED_TOOLS,
    "Microwave-safe bowl (for melting chocolate and peanut butter)",
    "Heatproof spatula or wooden spoon",
  ],
  "Breakfast of Champions": [
    ...CANDY_COATED_TOOLS,
    "Microwave-safe bowl (for melting white chocolate)",
    "Heatproof spatula or wooden spoon",
  ],

  // Savory / butter / seasoning–style
  "Classic Butter": [...SAVORY_TOOLS],
  "Classic Cheddar": [...SAVORY_TOOLS, "Small whisk (for mixing cheddar powder)"],
  "Bacon & Cheddar": [
    ...SAVORY_TOOLS,
    "Skillet and tongs or spatula (for cooking bacon)",
    "Paper towels (for draining bacon)",
  ],
  "Buffalo Ranch": [
    ...SAVORY_TOOLS,
    "Small whisk (for combining hot sauce and butter)",
  ],
  "Cracked Pepper & Asiago": [
    ...SAVORY_TOOLS,
    "Fine grater or microplane (for asiago)",
  ],
  "Dill Pickle": [
    ...SAVORY_TOOLS,
    "Spray bottle or small spoon (for light oil mist)",
  ],
  "Jalapeño": [...SAVORY_TOOLS],
  "Jalapeño & Cheddar": [
    ...SAVORY_TOOLS,
    "Small whisk (for mixing cheddar base)",
  ],
  "Nacho Cheddar": [
    ...SAVORY_TOOLS,
    "Small whisk (for nacho cheese butter base)",
  ],
  "Pepperoni Pizza": [
    ...SAVORY_TOOLS,
    "Cutting board and knife (for dicing pepperoni)",
    "Small grater (for parmesan, if using fresh)",
  ],
  Ranch: [...SAVORY_TOOLS],
  "Sour Cream & Onion": [...SAVORY_TOOLS],
  "Spicy Sriracha": [
    ...SAVORY_TOOLS,
    "Small whisk (for sriracha–honey butter)",
  ],
  "Blast-Off Chedda n Ranch": [
    ...SAVORY_TOOLS,
    "Small whisk (for cheddar–ranch butter)",
  ],
};

function getToolsForRecipe(name) {
  if (!name) return BASE_POPCORN_TOOLS;
  return TOOLS_MAP[name] || BASE_POPCORN_TOOLS;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function RecipeDetails({ currentUser }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  // favorites (DB-backed, same as main Recipes page)
  const [isFavorited, setIsFavorited] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  // normalize auth state
  const normalizedUserId =
    currentUser?.id ?? currentUser?.user_id ?? null;
  const isAuthed = normalizedUserId != null;

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

  // Load favorites for the logged-in user & check if THIS recipe is one
  useEffect(() => {
    if (!id || !isAuthed) return;

    let alive = true;

    (async () => {
      try {
        const data = await getFavorites();
        const ids = Array.isArray(data?.recipe_ids) ? data.recipe_ids : [];
        if (!alive) return;

        const numericId = Number(id);
        const isFav = ids.includes(numericId) || ids.includes(id);
        setIsFavorited(isFav);
      } catch {
        // ignore favorites fetch failures on details page
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, isAuthed]);

  const heroSrc = useMemo(() => {
    if (!recipe) return "";

    const v = recipe.hero_image_url;

    if (typeof v === "string" && (v.startsWith("http") || v.startsWith("/"))) {
      return v;
    }

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

  // --- INGREDIENT PARSING ----------------------------------------------------
  const parsedIngredients = useMemo(() => {
    if (!recipe) return [];

    const candidate =
      recipe.ingredients ??
      recipe.ingredients_text ??
      recipe.ingredientsText ??
      recipe.ingredient_list ??
      recipe.ingredientList ??
      null;

    if (!candidate) return [];

    const normalizeItem = (item) => {
      if (!item) return "";
      if (typeof item === "string") return item.trim();

      if (typeof item === "object") {
        if (item.name) return String(item.name).trim();
        if (item.ingredient) return String(item.ingredient).trim();
        if (item.text) return String(item.text).trim();
      }
      return "";
    };

    if (Array.isArray(candidate)) {
      return candidate.map(normalizeItem).filter(Boolean);
    }

    return String(candidate)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [recipe]);

  // --- INSTRUCTION PARSING → clean <ol> --------------------------------------
  const parsedInstructions = useMemo(() => {
    if (!recipe?.instructions) return [];

    return String(recipe.instructions)
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^\d+\.\s*/, ""));
  }, [recipe]);

  // --- TOOLS LIST ------------------------------------------------------------
  const toolsList = useMemo(
    () => getToolsForRecipe(recipe?.name),
    [recipe?.name]
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.name || "Doberpop Recipe",
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // user canceled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // ignore
    }

    const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(fb, "_blank", "noopener,noreferrer,width=900,height=700");
  };

  const handleFavoriteClick = async () => {
    if (!isAuthed || favBusy || !recipe) return;

    const next = !isFavorited;
    setFavBusy(true);
    setIsFavorited(next); // optimistic

    try {
      if (next) {
        await favoriteRecipe(recipe.id);
      } else {
        await unfavoriteRecipe(recipe.id);
      }
    } catch (e) {
      // rollback on failure
      setIsFavorited((prev) => !prev);
    } finally {
      setFavBusy(false);
    }
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
          </div>

          <div className="detailsHeaderRight">
            {/* FAVORITE PILL – only visible when user is signed in */}
            {isAuthed && (
              <button
                className={`detailsFavoriteBtn ${
                  isFavorited ? "isFavorited" : ""
                }`}
                onClick={handleFavoriteClick}
                type="button"
                aria-pressed={isFavorited}
                disabled={favBusy}
              >
                <span className="detailsFavoriteIcon" aria-hidden>
                  {isFavorited ? "♥" : "♡"}
                </span>
                <span className="detailsFavoriteLabel">
                  {isFavorited ? "Saved to Favorites" : "Save to Favorites"}
                </span>
              </button>
            )}

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
          {/* DESCRIPTION + META + TOOLS */}
          <section className="detailsCard">
            <div className="detailsLabel">Description</div>
            <div className="detailsText">
              {recipe?.description || "—"}

              <div className="detailsDescriptionMeta">
                {recipe?.kernel_type && (
                  <div>
                    <span className="detailsMetaLabel">Kernel profile:</span>{" "}
                    {recipe.kernel_type}
                  </div>
                )}
                {recipe?.yield && (
                  <div>
                    <span className="detailsMetaLabel">Yield:</span>{" "}
                    {recipe.yield} cups
                  </div>
                )}
              </div>

              {toolsList && toolsList.length > 0 && (
                <div className="detailsToolsBlock">
                  <div className="detailsMetaLabel">Tools &amp; supplies:</div>
                  <ul className="detailsToolsList">
                    {toolsList.map((tool, idx) => (
                      <li key={idx}>{tool}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* INGREDIENTS */}
          <section className="detailsCard">
            <div className="detailsLabel">Ingredients</div>
            {parsedIngredients.length > 0 ? (
              <ul className="detailsList">
                {parsedIngredients.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            ) : (
              <div className="detailsText">
                No ingredients have been added for this recipe yet.
              </div>
            )}
          </section>

          {/* INSTRUCTIONS */}
          <section className="detailsCard detailsCardFull">
            <div className="detailsLabel">Instructions</div>
            {parsedInstructions.length > 0 ? (
              <ol className="detailsSteps">
                {parsedInstructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            ) : (
              <div className="detailsText">—</div>
            )}
          </section>
        </div>

        <div className="detailsFootnote">
          Tip: Share opens Facebook + copies the full recipe text/link to your
          clipboard (paste it into the post).
        </div>
      </div>
    </div>
  );
}