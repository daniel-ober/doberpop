// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  getAdminUsers,
  getAdminRecipes,
  deleteAdminUser,
  deleteAdminRecipe,
} from "../../services/admin";
import "./AdminDashboard.css";

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
  const recipeRows = useMemo(() => recipes || [], [recipes]);

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

  return (
    <div className="adminDashboard">
      <h1>Admin Dashboard</h1>

      {/* USERS */}
      <h2>Users</h2>
      {loadingUsers ? (
        <p className="adminLoading">Loading users…</p>
      ) : usersError ? (
        <p className="adminError">{usersError}</p>
      ) : (
        <table className="adminTable">
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
      <h2>Recipes</h2>
      {loadingRecipes ? (
        <p className="adminLoading">Loading recipes…</p>
      ) : recipesError ? (
        <p className="adminError">{recipesError}</p>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Owner</th>
              <th>Created</th>
              <th className="adminActionsCol">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipeRows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title || r.name || "(untitled)"}</td>
                <td>{r.user?.username || r.username || r.user_id || "—"}</td>
                <td>{fmt(r.created_at || r.createdAt || r.inserted_at)}</td>
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
            ))}
          </tbody>
        </table>
      )}

      {/* CONFIRM MODAL */}
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
              <p className="adminModal__hint">
                This cannot be undone.
              </p>
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
    </div>
  );
}