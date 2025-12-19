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
  { key: "doberpop", label: "Doberpop" },
  { key: "mine", label: "My Recipes" },
  { key: "community", label: "Community" },
  { key: "favorites", label: "Favorites" },
];

export default function Recipes(props) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("az");
  const [tab, setTab] = useState("doberpop");

  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [favBusy, setFavBusy] = useState(() => new Set());

  const { recipes = [], handleDelete, currentUser } = props;

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await getFavorites();
        const ids = Array.isArray(data?.recipe_ids) ? data.recipe_ids : [];
        if (alive) setFavoriteIds(new Set(ids));
      } catch (e) {}
    };

    if (currentUser?.id) load();
    return () => {
      alive = false;
    };
  }, [currentUser?.id]);

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
    if (!currentUser?.id) return;
    if (favBusy.has(recipeId)) return;

    setFavBusy((prev) => new Set(prev).add(recipeId));

    // optimistic
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
    const uid = currentUser?.id;

    const doberpop = recipes.filter(
      (r) => r.source === "doberpop" && r.published === true
    );

    const mine = recipes.filter((r) => r.user_id === uid);

    const community = recipes.filter(
      (r) => r.source === "user" && r.published === true
    );

    const favorites = recipes.filter((r) => favoriteIds.has(r.id));

    return { doberpop, mine, community, favorites };
  }, [recipes, currentUser?.id, favoriteIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...(byTab[tab] || [])];

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
  }, [byTab, tab, query, sort]);

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
      ? "Tap the heart on any recipe to add it to Favorites."
      : "Try a different search, or create the first one.";

  return (
    <div className="page recipes">
      <div className="page__header">
        <div>
          <h1 className="page__title">Recipes</h1>
          <p className="page__subtitle">
            Browse the catalog{currentUser?.id ? " — edit yours anytime." : "."}
          </p>
        </div>

        <Link className="btn btn--primary" to="/recipes/new">
          + New Recipe
        </Link>
      </div>

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
              {(byTab[t.key] || []).length}
            </span>
          </button>
        ))}
      </div>

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
            const isOwner = currentUser?.id === recipe.user_id;
            const favorited = isFav(recipe.id);
            const busy = favBusy.has(recipe.id);

            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                to={`/recipes/${recipe.id}`}
                isFavorited={favorited}
                favoriteLoading={busy}
                onToggleFavorite={toggleFavorite}
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