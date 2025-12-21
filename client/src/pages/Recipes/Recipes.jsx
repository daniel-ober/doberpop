// client/src/pages/Recipes/Recipes.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import {
  getFavorites,
  favoriteRecipe,
  unfavoriteRecipe,
} from "../../services/favorites";
import "./Recipes.css";

const TABS = [
  { key: "doberpop", label: "Signature Batches" },
  { key: "mine", label: "My Batch Ideas" },
  // { key: "community", label: "Community" },
  { key: "favorites", label: "Batch Favorites" },
];

// how many official recipes a logged-out user can preview in the sampler
const SAMPLE_RECIPE_LIMIT = 20;

// Local fallback: count ALL official signature batches
// (non-user-submitted) from whatever list we have in memory.
function getTotalSignatureCount(recipes) {
  if (!Array.isArray(recipes)) return 0;

  return recipes.filter((r) => {
    if (!r) return false;
    const isUserSubmitted = r.source === "user";
    return !isUserSubmitted;
  }).length;
}

export default function Recipes(props) {
  const {
    recipes = [],
    handleDelete,
    currentUser,
    loading,
    totalSignatureCount: totalSignatureCountFromServer,
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [query, setQuery] = useState("");

  // default sort:
  // - signed in  -> most_favorited
  // - guest      -> A → Z
  const initialSort = currentUser ? "most_favorited" : "az";
  const [sort, setSort] = useState(initialSort);

  const [tab, setTab] = useState("doberpop");

  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [favBusy, setFavBusy] = useState(() => new Set());

  // mini-filter just for "My Recipes" tab
  // all | private | community
  const [mineFilter, setMineFilter] = useState("all");

  // derive a normalized user id once
  const normalizedUserId = currentUser?.id ?? currentUser?.user_id ?? null;
  const isAuthed = normalizedUserId != null;

  // --- loading UX guard so we don't flash "No recipes" while the first fetch runs ---
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    // Handle initial mount separately. If we *already* have recipes
    // (e.g. navigating back from a detail page), mark as loaded immediately.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;

      if (Array.isArray(recipes) && recipes.length > 0) {
        setHasLoadedRecipes(true);
      }

      return;
    }

    // Any subsequent change to `recipes` means the fetch completed.
    if (Array.isArray(recipes)) {
      setHasLoadedRecipes(true);
    }
  }, [recipes]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await getFavorites();
        const ids = Array.isArray(data?.recipe_ids) ? data.recipe_ids : [];
        if (alive) setFavoriteIds(new Set(ids));
      } catch {
        // ignore favorites fetch failures
      }
    };

    if (normalizedUserId != null) load();
    return () => {
      alive = false;
    };
  }, [normalizedUserId]);

  const openDelete = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const closeDelete = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    await handleDelete(selectedId);
    closeDelete();
  };

  const isFav = (recipeId) => favoriteIds.has(recipeId);

  const toggleFavorite = async (recipeId, nextState) => {
    if (normalizedUserId == null) return;
    if (favBusy.has(recipeId)) return;

    setFavBusy((prev) => new Set(prev).add(recipeId));

    // optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (nextState) next.add(recipeId);
      else next.delete(recipeId);
      return next;
    });

    try {
      if (nextState) await favoriteRecipe(recipeId);
      else await unfavoriteRecipe(recipeId);
    } catch {
      // rollback on error
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (nextState) next.delete(recipeId);
        else next.add(recipeId);
        return next;
      });
    } finally {
      setFavBusy((prev) => {
        const next = new Set(prev);
        next.delete(recipeId);
        return next;
      });
    }
  };

  const byTab = useMemo(() => {
    // All official Doberpop recipes (public only)
    const doberpop = recipes.filter(
      (r) => r.source === "doberpop" && r.published === true
    );

    // ALL recipes created by the signed-in user (private + shared)
    const mineAll =
      normalizedUserId == null
        ? []
        : recipes.filter((r) => {
            if (r.user_id == null) return false;
            return String(r.user_id) === String(normalizedUserId);
          });

    // Community = user-created + shared (kept for future)
    const community = recipes.filter(
      (r) => r.source === "user" && r.published === true
    );

    const favorites = recipes.filter((r) => favoriteIds.has(r.id));

    return { doberpop, mineAll, community, favorites };
  }, [recipes, normalizedUserId, favoriteIds]);

  // 🔥 authoritative count of ALL signature batches in the full library
  const totalSignatureCount = useMemo(() => {
    if (typeof totalSignatureCountFromServer === "number") {
      return totalSignatureCountFromServer;
    }
    // graceful fallback if metadata wasn’t provided
    return getTotalSignatureCount(recipes);
  }, [totalSignatureCountFromServer, recipes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    // -------------------------------------------------------
    // GUESTS on "Signature Batches" tab:
    // Use the admin-defined sampler lineup order
    // (show_in_sampler + sampler_position), capped by
    // SAMPLE_RECIPE_LIMIT.
    // -------------------------------------------------------
    if (!isAuthed && tab === "doberpop") {
      let list = (byTab.doberpop || [])
        .filter((r) => r.show_in_sampler)
        .sort((a, b) => {
          const aPos =
            typeof a.sampler_position === "number" ? a.sampler_position : 0;
          const bPos =
            typeof b.sampler_position === "number" ? b.sampler_position : 0;
          return aPos - bPos;
        });

      if (q) {
        list = list.filter((r) => (r.name || "").toLowerCase().includes(q));
      }

      // guests see the curated sampler list, up to the configured limit
      return list.slice(0, SAMPLE_RECIPE_LIMIT);
    }

    // -------------------------------------------------------
    // EVERY OTHER CASE:
    // Keep your existing sort + filter behavior
    // -------------------------------------------------------
    let baseList;

    if (tab === "mine") {
      const mineAll = byTab.mineAll || [];

      if (mineFilter === "private") {
        baseList = mineAll.filter((r) => !r.published);
      } else if (mineFilter === "community") {
        baseList = mineAll.filter((r) => r.published);
      } else {
        baseList = mineAll;
      }
    } else {
      baseList = [...(byTab[tab === "mine" ? "mineAll" : tab] || [])];
    }

    let list = [...baseList];

    if (q) {
      list = list.filter((r) => (r.name || "").toLowerCase().includes(q));
    }

    const getTime = (r) => {
      const t = r.created_at || r.updated_at;
      const ms = t ? Date.parse(t) : NaN;
      return Number.isFinite(ms) ? ms : 0;
    };

    switch (sort) {
      case "za":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;

      case "newest":
        list.sort((a, b) => getTime(b) - getTime(a));
        break;

      case "oldest":
        list.sort((a, b) => getTime(a) - getTime(b));
        break;

      case "most_favorited": {
        list.sort((a, b) => {
          const af = a.favorites_count || 0;
          const bf = b.favorites_count || 0;
          if (bf !== af) return bf - af; // higher favorites first
          return (a.name || "").localeCompare(b.name || "");
        });
        break;
      }

      case "az":
      default:
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
    }

    return list;
  }, [byTab, tab, query, sort, mineFilter, isAuthed]);

  const emptyTitle =
    tab === "doberpop"
      ? "No Doberpop recipes found."
      : tab === "mine"
      ? "No recipes found in My Recipes."
      : tab === "community"
      ? "No community recipes found."
      : "No favorites yet.";

  const emptyText =
    tab === "favorites"
      ? normalizedUserId == null
        ? "Sign in to start saving favorites."
        : "Tap the heart on any recipe to add it to Favorites."
      : "Try a different search, or create the first one.";

  const canFavorite = normalizedUserId != null;

  // Show upsell for any guest browsing Signature Batches
  const shouldShowUpsell = !isAuthed && tab === "doberpop";

  // Tabs visible in the UI (none for guests – pill hidden)
  const visibleTabs = isAuthed ? TABS : [];

  return (
    <div className="page recipes">
      <div className="page__header">
        <div>
          <h1 className="page__title">Batch Library</h1>
<p className="recipesUpsell__text">
  You&apos;re looking at a limited sampler of Doberpop favorites. Create a free
  account to unlock{" "}
  <span className="page__subtitleHighlight">
    all {totalSignatureCount}
  </span>{" "}
  signature recipes, explore the full library, and start building your own
  popcorn experiments.
</p>
        </div>

        {tab === "mine" && isAuthed && (
          <Link className="btn btn--primary" to="/recipes/new">
            Log Your Batch Idea
          </Link>
        )}
      </div>

      {/* Main tabs – guests see NO pills */}
      <div className="recipesTabs">
        {visibleTabs.map((t) => {
          let countDisplay;

          if (t.key === "doberpop") {
            // Signed-in users see total full-library signature batch count
            countDisplay = isAuthed ? totalSignatureCount : null;
          } else {
            const baseList =
              t.key === "mine" ? byTab.mineAll : byTab[t.key] || [];
            countDisplay = baseList.length;
          }

          return (
            <button
              key={t.key}
              className={`recipesTab ${tab === t.key ? "isActive" : ""}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
              <span className="recipesTab__count">{countDisplay}</span>
            </button>
          );
        })}
      </div>

      {/* Mini filters inside "My Recipes" (authed only) */}
      {tab === "mine" && isAuthed && (
        <div className="recipesTabs" style={{ marginTop: 4, marginBottom: 10 }}>
          <button
            type="button"
            className={`recipesTab ${mineFilter === "all" ? "isActive" : ""}`}
            onClick={() => setMineFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`recipesTab ${
              mineFilter === "private" ? "isActive" : ""
            }`}
            onClick={() => setMineFilter("private")}
          >
            Private
          </button>
          <button
            type="button"
            className={`recipesTab ${
              mineFilter === "community" ? "isActive" : ""
            }`}
            onClick={() => setMineFilter("community")}
          >
            Shared to community
          </button>
        </div>
      )}

      {/* Search + sort toolbar – hidden for guests */}
      {isAuthed && (
        <div className="toolbar">
          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes…"
            aria-label="Search recipes"
          />

          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort recipes"
          >
            <option value="most_favorited">Sort: Most favorited</option>
            <option value="az">Sort: A → Z</option>
            <option value="za">Sort: Z → A</option>
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>
      )}

      {/* MAIN CONTENT: loading → empty → grid */}
      {!hasLoadedRecipes ? (
        <div className="recipesLoading">
          <div className="recipesLoading__spinner" />
          <div className="recipesLoading__text">Loading batches…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__title">{emptyTitle}</div>
          <div className="empty__text">{emptyText}</div>
          {tab !== "favorites" && isAuthed && (
            <Link className="btn btn--ghost" to="/recipes/new">
              Create a recipe
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid">
            {filtered.map((recipe) => {
              const isOwner =
                normalizedUserId != null &&
                recipe.user_id != null &&
                String(recipe.user_id) === String(normalizedUserId);

              const favorited = isFav(recipe.id);
              const busy = favBusy.has(recipe.id);

              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  to={`/recipes/${recipe.id}`}
                  isFavorited={canFavorite ? favorited : false}
                  favoriteLoading={canFavorite ? busy : false}
                  // if not logged in, pass no handler so heart doesn't render
                  onToggleFavorite={canFavorite ? toggleFavorite : undefined}
                  rightActions={
                    isOwner ? (
                      <>
                        <Link
                          className="iconBtn"
                          to={`/recipes/${recipe.id}/edit`}
                          aria-label="Edit recipe"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            className="iconBtn__img"
                            src="https://i.imgur.com/FFDaXm9.png"
                            alt="edit"
                          />
                        </Link>

                        <button
                          className="iconBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDelete(recipe.id);
                          }}
                          aria-label="Delete recipe"
                          type="button"
                        >
                          <img
                            className="iconBtn__img"
                            src="https://i.imgur.com/3yTHceK.png"
                            alt="delete"
                          />
                        </button>
                      </>
                    ) : null
                  }
                />
              );
            })}
          </div>

          {shouldShowUpsell && (
            <div className="recipesUpsell">
              <h3 className="recipesUpsell__title">
                Unlock the full batch library
              </h3>
<p className="recipesUpsell__text">
  Ready to go beyond the sampler? Create a free account to unlock{" "}
  <span className="recipesUpsell__highlight">
    all {totalSignatureCount}
  </span>{" "}
  signature recipes, access the full batch library, and turn ideas into
  seriously good popcorn.
</p>

              <div className="recipesUpsell__actions">
                <Link
                  to="/register"
                  className="recipesUpsell__btn recipesUpsell__btn--primary"
                >
                  Create free account
                </Link>
                <Link
                  to="/login"
                  className="recipesUpsell__btn recipesUpsell__btn--ghost"
                >
                  I already have an account
                </Link>
              </div>

              <p className="recipesUpsell__hint">
                No spam. Just tools for dialing in ridiculous popcorn.
              </p>
            </div>
          )}
        </>
      )}

      {open && (
        <Modal
          open={open}
          handleOpen={closeDelete}
          handleDelete={confirmDelete}
        />
      )}
    </div>
  );
}
