import { useEffect, useMemo, useState } from "react";
import { updateRecipe } from "../../services/recipes";
import "./SamplerLineup.css";

export default function SamplerLineup({ recipes = [], onRefresh }) {
  const [lineup, setLineup] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const nextLineup = [...recipes]
      .filter((r) => r.source === "doberpop" && r.show_in_sampler === true)
      .sort((a, b) => {
        const aPos =
          typeof a.sampler_position === "number" ? a.sampler_position : 9999;
        const bPos =
          typeof b.sampler_position === "number" ? b.sampler_position : 9999;
        return aPos - bPos;
      });

    setLineup(nextLineup);
  }, [recipes]);

  const maxSlots = 20;
  const count = lineup.length;

  const persistOrder = async (nextList) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await Promise.all(
        nextList.map((recipe, index) =>
          updateRecipe(recipe.id, {
            sampler_position: index + 1,
            show_in_sampler: true,
          })
        )
      );

      setSuccess("Sampler order updated.");
      if (typeof onRefresh === "function") {
        await onRefresh();
      }
    } catch (e) {
      console.error("Failed to save sampler order", e);
      setError(e?.message || "Unable to save sampler order.");
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (index) => () => {
    setDragIndex(index);
  };

  const handleDragOver = (index) => (e) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    setLineup((prev) => {
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
    await persistOrder(lineup);
  };

  const moveItem = (index, direction) => {
    setLineup((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= next.length) return prev;

      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);

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

      {!lineup.length && !error && (
        <div className="samplerPanel__meta">
          No recipes are currently in the sampler. Toggle “Showing” in the admin
          table to add some.
        </div>
      )}

      {lineup.length > 0 && (
        <ul className="samplerPanel__list" onDrop={handleDrop}>
          {lineup.map((r, index) => (
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
                  disabled={index === lineup.length - 1 || saving}
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