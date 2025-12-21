// client/src/pages/AdminDashboard/SamplerLineup.jsx
import { useEffect, useState } from "react";
import api from "../../services/api-config";
import "./SamplerLineup.css";

export default function SamplerLineup({ refreshToken }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  }, [refreshToken]); // ✅ refetch whenever admin toggles sampler

  const maxSlots = recipes[0]?.max_sampler_slots || 20;
  const count = recipes.length;

  // --- simple HTML5 drag/drop ---
  const [dragIndex, setDragIndex] = useState(null);

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

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const sampler_order = recipes.map((r) => r.id);

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
  };

  return (
    <section className="samplerPanel">
      <header className="samplerPanel__header">
        <div>
          <h2 className="samplerPanel__title">Sampler lineup</h2>
          <p className="samplerPanel__subtitle">
            Drag to set the order of recipes shown to non-signed-in visitors.
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