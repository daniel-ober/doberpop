// client/src/pages/Recipes/Recipes.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import RecipeCard from "../../components/RecipeCard/RecipeCard";

import {
  getFavorites,
  favoriteRecipe,
  unfavoriteRecipe,
} from "../../services/favorites";

const TABS = [
  { key: "doberpop", label: "Signature Batches" },
  { key: "mine", label: "My Batch Ideas" },
  // { key: "community", label: "Community" },
  { key: "favorites", label: "Batch Favorites" },
];

export default function Recipes(props) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("az");
  const [tab, setTab] = useState("doberpop");

  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [favBusy, setFavBusy] = useState(() => new Set());

  // mini-filter just for "My Recipes" tab
  // all | private | community
  const [mineFilter, setMineFilter] = useState("all");

  const { recipes = [], handleDelete, currentUser } = props;

  // derive a normalized user id once
  const normalizedUserId =
    currentUser?.id ?? currentUser?.user_id ?? null;

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await getFavorites();
        const ids = Array.isArray(data?.recipe_ids) ? data.recipe_ids : [];
        if (alive) setFavoriteIds(new Set(ids));
      } catch (e) {
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
    } catch (e) {
      // rollback
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

    // Community = user-created + shared
    const community = recipes.filter(
      (r) => r.source === "user" && r.published === true
    );

    const favorites = recipes.filter((r) => favoriteIds.has(r.id));

    return { doberpop, mineAll, community, favorites };
  }, [recipes, normalizedUserId, favoriteIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
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
      case "az":
      default:
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
    }

    return list;
  }, [byTab, tab, query, sort, mineFilter]);

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

  return (
    <div className="page recipes">
      <div className="page__header">
        <div>
          <h1 className="page__title">Batch Library</h1>
          <p className="page__subtitle">
            Browse the catalog
            {normalizedUserId != null ? " — edit yours anytime." : "."}
          </p>
        </div>

        {tab === "mine" && normalizedUserId != null && (
          <Link className="btn btn--primary" to="/recipes/new">
            Log Your Batch Idea
          </Link>
        )}
      </div>

      {/* Main tabs */}
      <div className="recipesTabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`recipesTab ${tab === t.key ? "isActive" : ""}`}
            onClick={() => setTab(t.key)}
            type="button"
          >
            {t.label}{" "}
            <span className="recipesTab__count">
              {(t.key === "mine" ? byTab.mineAll : byTab[t.key] || []).length}
            </span>
          </button>
        ))}
      </div>

      {/* Mini filters inside "My Recipes" */}
      {tab === "mine" && (
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
          <option value="az">Sort: A → Z</option>
          <option value="za">Sort: Z → A</option>
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__title">{emptyTitle}</div>
          <div className="empty__text">{emptyText}</div>
          {tab !== "favorites" && (
            <Link className="btn btn--ghost" to="/recipes/new">
              Create a recipe
            </Link>
          )}
        </div>
      ) : (
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