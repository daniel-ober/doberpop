import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";

export default function Recipes(props) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("az"); // az | za | newest | oldest

  const { recipes = [], handleDelete, currentUser } = props;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = [...recipes];
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
  }, [recipes, query, sort]);

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

  return (
    <div className="page">
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
          <div className="empty__title">No recipes found</div>
          <div className="empty__text">
            Try a different search, or create the first one.
          </div>
          <Link className="btn btn--ghost" to="/recipes/new">
            Create a recipe
          </Link>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((recipe) => {
            const isOwner = currentUser?.id === recipe.user_id;

            return (
              <div className="card" key={recipe.id}>
                <Link className="card__link" to={`/recipes/${recipe.id}`}>
                  <div className="card__title">{recipe.name}</div>
                  <div className="card__meta">
                    {recipe.kernel_type ? `Kernel: ${recipe.kernel_type}` : "—"}
                  </div>
                </Link>

                {isOwner && (
                  <div className="card__actions">
                    <Link
                      className="iconBtn"
                      to={`/recipes/${recipe.id}/edit`}
                      aria-label="Edit recipe"
                    >
                      <img
                        className="iconBtn__img"
                        src="https://i.imgur.com/FFDaXm9.png"
                        alt="edit"
                      />
                    </Link>

                    <button
                      className="iconBtn"
                      onClick={() => openDelete(recipe.id)}
                      aria-label="Delete recipe"
                    >
                      <img
                        className="iconBtn__img"
                        src="https://i.imgur.com/3yTHceK.png"
                        alt="delete"
                      />
                    </button>
                  </div>
                )}
              </div>
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