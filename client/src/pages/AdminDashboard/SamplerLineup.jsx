import { useEffect, useState } from "react";
import api from "../../services/api-config";
import "./SamplerLineup.css";

export default function SamplerLineup({ refreshToken }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // desktop drag state
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const fetchLineup = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/admin/recipes/sampler_lineup");
        const data = Array.isArray(res.data) ? res.data : res.data.recipes || [];

        setRecipes(data);
      } catch (e) {
        console.error("Failed to load sampler lineup", e);
        setError(e.message || "Unable to load sampler lineup.");
      } finally {
        setLoading(false);
      }
    };

    fetchLineup();
  }, [refreshToken]);

  const maxSlots = recipes[0]?.max_sampler_slots || 20;
  const count = recipes.length;

  // ----- shared save helper (used by drag + arrow buttons) -----
  async function persistOrder(nextList) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const sampler_order = nextList.map((r) => r.id);

      await api.patch("/api/admin/recipes/sampler_order", {
        sampler_order,
      });

      setSuccess("Sampler order updated.");
    } catch (e) {
      console.error("Failed to save sampler order", e);
      setError(e.message || "Unable to save sampler order.");
    } finally {
      setSaving(false);
    }
  }

  // ----- desktop drag / drop -----
  const handleDragStart = (index) => () => {
    setDragIndex(index);
  };

  const handleDragOver = (index) => (e) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    setRecipes((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handleDrop = async () => {
    if (dragIndex === null) return;
    setDragIndex(null);
    await persistOrder(recipes);
  };

  // ----- mobile / keyboard-friendly up/down buttons -----
  const moveItem = (index, direction) => {
    setRecipes((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= next.length) return prev;

      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);

      // fire-and-forget save (don’t block UI)
      void persistOrder(next);

      return next;
    });
  };

  return (
    <section className="samplerPanel">
      <header className="samplerPanel__header">
        <div>
          <h2 className="samplerPanel__title">Sampler lineup</h2>
          <p className="samplerPanel__subtitle">
            Drag on desktop, or use the arrows on mobile, to set the order of
            recipes shown to non-signed-in visitors.
          </p>
        </div>
        <div className="samplerPanel__badgeGroup">
          <span className="samplerPanel__badge">
            {count} / {maxSlots} slots used
          </span>
        </div>
      </header>

      {loading && <div className="samplerPanel__meta">Loading lineup…</div>}

      {error && (
        <div className="samplerPanel__alert samplerPanel__alert--error">
          {error}
        </div>
      )}

      {success && (
        <div className="samplerPanel__alert samplerPanel__alert--success">
          {success}
        </div>
      )}

      {!loading && !recipes.length && !error && (
        <div className="samplerPanel__meta">
          No recipes are currently in the sampler. Toggle “Showing” in the admin
          table to add some.
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <ul className="samplerPanel__list" onDrop={handleDrop}>
          {recipes.map((r, index) => (
            <li
              key={r.id}
              className="samplerPanel__item"
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
            >
              <span className="samplerPanel__handle" aria-hidden="true">
                ☰
              </span>

              <div className="samplerPanel__itemMain">
                <div className="samplerPanel__itemTitle">
                  #{index + 1} – {r.title || r.name || "(untitled)"}
                </div>
                <div className="samplerPanel__itemMeta">
                  Favorites: {r.favorites_count || 0} · ID: {r.id}
                </div>
              </div>

              {/* Arrow controls – these will be visible on mobile via CSS */}
              <div className="samplerPanel__itemControls">
                <button
                  type="button"
                  className="samplerPanel__moveBtn"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0 || saving}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="samplerPanel__moveBtn"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === recipes.length - 1 || saving}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {saving && (
        <div className="samplerPanel__meta samplerPanel__meta--saving">
          Saving order…
        </div>
      )}
    </section>
  );
}