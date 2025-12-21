// client/src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  getAdminUsers,
  getAdminRecipes,
  deleteAdminUser,
  deleteAdminRecipe,
} from "../../services/admin";
import api from "../../services/api-config";
import "./AdminDashboard.css";
import SamplerLineup from "./SamplerLineup";

function getCreatedAt(row) {
  const raw = row?.created_at || row?.createdAt || row?.inserted_at;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getFavoritesCount(recipe) {
  if (!recipe) return 0;

  if (typeof recipe.favorites_count === "number") return recipe.favorites_count;
  if (typeof recipe.favoritesCount === "number") return recipe.favoritesCount;
  if (typeof recipe.likes_count === "number") return recipe.likes_count;

  if (Array.isArray(recipe.favorites)) return recipe.favorites.length;
  if (Array.isArray(recipe.likes)) return recipe.likes.length;

  return 0;
}

function getFavoritesUsers(recipe) {
  if (!recipe) return [];

  const arr =
    recipe.favorited_users ||
    recipe.favorite_users ||
    recipe.favorites ||
    recipe.likes ||
    [];

  if (!Array.isArray(arr)) return [];

  return arr;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [usersError, setUsersError] = useState("");
  const [recipesError, setRecipesError] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  // delete modal state
  const [confirm, setConfirm] = useState(null);
  // { type: "user"|"recipe", id: number, label: string }

  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  // recipe sort
  const [recipeSort, setRecipeSort] = useState("most_favorited");

  // favorites modal
  const [favoritesModalRecipe, setFavoritesModalRecipe] = useState(null);

  // sampler toggle busy state
  const [samplerBusyIds, setSamplerBusyIds] = useState(() => new Set());

  // used to tell SamplerLineup when to refetch
  const [samplerRefreshToken, setSamplerRefreshToken] = useState(0);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await getAdminUsers();
        if (!alive) return;
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (e) {
        if (!alive) return;
        setUsersError(e?.message || "Failed to load users");
      } finally {
        if (!alive) return;
        setLoadingUsers(false);
      }
    })();

    (async () => {
      try {
        const data = await getAdminRecipes();
        if (!alive) return;
        setRecipes(Array.isArray(data) ? data : data.recipes || []);
      } catch (e) {
        if (!alive) return;
        setRecipesError(e?.message || "Failed to load recipes");
      } finally {
        if (!alive) return;
        setLoadingRecipes(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const fmt = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "—";
    }
  };

  const usersRows = useMemo(() => users || [], [users]);
  const usersById = useMemo(() => {
    const map = new Map();
    (users || []).forEach((u) => {
      if (u && typeof u.id !== "undefined") {
        map.set(u.id, u);
      }
    });
    return map;
  }, [users]);

  const recipeRows = useMemo(() => recipes || [], [recipes]);

  const sortedRecipeRows = useMemo(() => {
    const rows = [...recipeRows];

    rows.sort((a, b) => {
      const aName = (a.title || a.name || "").toLowerCase();
      const bName = (b.title || b.name || "").toLowerCase();

      const aDate = getCreatedAt(a)?.getTime() || 0;
      const bDate = getCreatedAt(b)?.getTime() || 0;

      const aFav = getFavoritesCount(a);
      const bFav = getFavoritesCount(b);

      switch (recipeSort) {
        case "title_asc":
          return aName.localeCompare(bName);
        case "title_desc":
          return bName.localeCompare(aName);
        case "created_newest":
          return bDate - aDate;
        case "created_oldest":
          return aDate - bDate;
        case "least_favorited":
          return aFav - bFav;
        case "most_favorited":
        default:
          return bFav - aFav;
      }
    });

    return rows;
  }, [recipeRows, recipeSort]);

  // Map of recipe IDs that are in the "top 3" favorites (with count > 0)
  const topFavoriteRecipeIds = useMemo(() => {
    const arr = (recipeRows || []).map((r) => ({
      id: r.id,
      count: getFavoritesCount(r),
    }));
    arr.sort((a, b) => b.count - a.count);
    const top = arr.filter((x) => x.count > 0).slice(0, 3);
    const map = new Map();
    top.forEach((x) => map.set(x.id, true));
    return map;
  }, [recipeRows]);

  const openDelete = (type, row) => {
    setActionError("");
    if (type === "user") {
      setConfirm({
        type,
        id: row.id,
        label: `${row.username || "user"} (#${row.id})`,
      });
    } else {
      setConfirm({
        type,
        id: row.id,
        label: `${row.title || row.name || "recipe"} (#${row.id})`,
      });
    }
  };

  const closeDelete = () => {
    if (deleting) return;
    setConfirm(null);
    setActionError("");
  };

  const doDelete = async () => {
    if (!confirm) return;

    setDeleting(true);
    setActionError("");

    try {
      if (confirm.type === "user") {
        await deleteAdminUser(confirm.id);
        setUsers((prev) => prev.filter((u) => u.id !== confirm.id));
      } else {
        await deleteAdminRecipe(confirm.id);
        setRecipes((prev) => prev.filter((r) => r.id !== confirm.id));
      }
      setConfirm(null);
    } catch (e) {
      setActionError(e?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const openFavoritesModal = (recipe) => {
    setFavoritesModalRecipe(recipe);
  };

  const closeFavoritesModal = () => {
    setFavoritesModalRecipe(null);
  };

  const favoritesModalUsers = useMemo(
    () => getFavoritesUsers(favoritesModalRecipe),
    [favoritesModalRecipe]
  );

  // ---- sampler toggle ----
  const handleToggleSampler = async (recipe) => {
    if (!recipe || typeof recipe.id === "undefined") return;

    const id = recipe.id;
    const prev = !!recipe.show_in_sampler;
    const next = !prev;

    // optimistic UI update
    setRecipes((prevList) =>
      prevList.map((r) =>
        r.id === id ? { ...r, show_in_sampler: next } : r
      )
    );
    setSamplerBusyIds((prevSet) => {
      const nextSet = new Set(prevSet);
      nextSet.add(id);
      return nextSet;
    });
    setActionError("");

    try {
      await api.patch(`/api/admin/recipes/${id}`, {
        show_in_sampler: next,
      });

      // tell SamplerLineup to refetch
      setSamplerRefreshToken((t) => t + 1);
    } catch (e) {
      console.error("Failed to update sampler flag", e);
      // rollback on error
      setRecipes((prevList) =>
        prevList.map((r) =>
          r.id === id ? { ...r, show_in_sampler: prev } : r
        )
      );
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Failed to update sampler setting.";
      setActionError(msg);
    } finally {
      setSamplerBusyIds((prevSet) => {
        const nextSet = new Set(prevSet);
        nextSet.delete(id);
        return nextSet;
      });
    }
  };

  return (
    <div className="adminDashboardPage">
      <div className="adminDashboard">
        <h1>Admin Dashboard</h1>

        {actionError && (
          <p className="adminError" style={{ marginTop: 0 }}>
            {actionError}
          </p>
        )}

        {/* USERS */}
        <h2>Users</h2>
        {loadingUsers ? (
          <p className="adminLoading">Loading users…</p>
        ) : usersError ? (
          <p className="adminError">{usersError}</p>
        ) : (
          <table className="adminTable adminTable--users">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Created</th>
                <th className="adminActionsCol">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersRows.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`adminBadge ${
                        u.admin ? "adminBadge--yes" : "adminBadge--no"
                      }`}
                    >
                      {u.admin ? "YES" : "no"}
                    </span>
                  </td>
                  <td>{fmt(u.created_at || u.createdAt || u.inserted_at)}</td>
                  <td className="adminActionsCell">
                    <button
                      className="adminBtn adminBtn--danger"
                      onClick={() => openDelete("user", u)}
                      disabled={deleting}
                      type="button"
                      title="Delete user"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* RECIPES */}
        <div className="adminRecipesHeaderRow">
          <h2>Recipes</h2>
          <div className="adminSortRow">
            <span className="adminSortLabel">Sort recipes by:</span>
            <select
              className="adminSortSelect"
              value={recipeSort}
              onChange={(e) => setRecipeSort(e.target.value)}
            >
              <option value="most_favorited">Most favorited</option>
              <option value="least_favorited">Least favorited</option>
              <option value="title_asc">Title A–Z</option>
              <option value="title_desc">Title Z–A</option>
              <option value="created_newest">Newest</option>
              <option value="created_oldest">Oldest</option>
            </select>
          </div>
        </div>

        {loadingRecipes ? (
          <p className="adminLoading">Loading recipes…</p>
        ) : recipesError ? (
          <p className="adminError">{recipesError}</p>
        ) : (
          <table className="adminTable adminTable--recipes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Owner</th>
                <th>Created</th>
                <th className="adminSamplerCol">Sampler</th>
                <th className="adminFavoritesCol">Favorites</th>
                <th className="adminActionsCol">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecipeRows.map((r) => {
                const favCount = getFavoritesCount(r);
                const isTopFavorite = topFavoriteRecipeIds.has(r.id);

                const ownerUsername =
                  r.user?.username ||
                  r.username ||
                  (typeof r.user_id !== "undefined" &&
                    usersById.get(r.user_id)?.username) ||
                  r.user_id ||
                  "—";

                const isSampler = !!r.show_in_sampler;
                const samplerBusy = samplerBusyIds.has(r.id);

                let favoritesCellContent;

                if (favCount <= 0) {
                  favoritesCellContent = (
                    <span className="adminFavoritesPlaceholder">--</span>
                  );
                } else {
                  const pillClass = isTopFavorite
                    ? "adminBadge adminBadge--favoriteTop"
                    : "adminBadge adminBadge--favorite";

                  favoritesCellContent = (
                    <button
                      type="button"
                      className={pillClass}
                      onClick={() => openFavoritesModal(r)}
                      title="Click to view users who favorited this recipe"
                    >
                      {favCount}
                    </button>
                  );
                }

                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.title || r.name || "(untitled)"}</td>
                    <td>{ownerUsername}</td>
                    <td>{fmt(r.created_at || r.createdAt || r.inserted_at)}</td>
                    <td className="adminSamplerCell">
                      <button
                        type="button"
                        className={
                          "adminSamplerToggle " +
                          (isSampler
                            ? "adminSamplerToggle--on"
                            : "adminSamplerToggle--off")
                        }
                        onClick={() => handleToggleSampler(r)}
                        disabled={samplerBusy}
                        title={
                          isSampler
                            ? "Click to hide from guest sampler"
                            : "Click to show in guest sampler"
                        }
                      >
                        {isSampler ? "Showing" : "Hidden"}
                      </button>
                    </td>
                    <td className="adminFavoritesCell">
                      {favoritesCellContent}
                    </td>
                    <td className="adminActionsCell">
                      <button
                        className="adminBtn adminBtn--danger"
                        onClick={() => openDelete("recipe", r)}
                        disabled={deleting}
                        type="button"
                        title="Delete recipe"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Sampler lineup card listens to refreshToken */}
        <SamplerLineup refreshToken={samplerRefreshToken} />

        {/* CONFIRM DELETE MODAL */}
        {confirm && (
          <div className="adminModalOverlay" onMouseDown={closeDelete}>
            <div
              className="adminModal"
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="adminModal__title">Confirm delete</div>
              <div className="adminModal__body">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{confirm.label}</strong>?
                </p>
                <p className="adminModal__hint">This cannot be undone.</p>
                {actionError && <p className="adminError">{actionError}</p>}
              </div>

              <div className="adminModal__actions">
                <button
                  className="adminBtn"
                  onClick={closeDelete}
                  disabled={deleting}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="adminBtn adminBtn--danger"
                  onClick={doDelete}
                  disabled={deleting}
                  type="button"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAVORITES MODAL */}
        {favoritesModalRecipe && (
          <div
            className="adminModalOverlay"
            onMouseDown={closeFavoritesModal}
          >
            <div
              className="adminModal"
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="adminModal__title">
                Favorited by{" "}
                {favoritesModalRecipe.title ||
                  favoritesModalRecipe.name ||
                  "(untitled)"}
              </div>
              <div className="adminModal__body">
                {favoritesModalUsers.length === 0 ? (
                  <p className="adminModal__hint">
                    No users have favorited this recipe yet.
                  </p>
                ) : (
                  <ul className="adminModalList">
                    {favoritesModalUsers.map((u, idx) => {
                      const username =
                        u.username || u.handle || u.name || u.email || String(u);
                      const email =
                        u.email && u.email !== username ? ` (${u.email})` : "";
                      return (
                        <li key={idx}>
                          <span className="adminModalList__bullet">★</span>
                          <span>
                            {username}
                            {email}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="adminModal__actions">
                <button
                  type="button"
                  className="adminBtn"
                  onClick={closeFavoritesModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}