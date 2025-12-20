// client/src/pages/RecipeEdit/RecipeEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./RecipeEdit.css";
import api from "../../services/api-config";

const KERNEL_OPTIONS = ["Butterfly", "Mushroom", "Mixed"];

export default function RecipeEdit() {
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    kernel_type: "Butterfly",
    yield: "1",
    ingredients: "",
    instructions: "",
    published: false,
  });

  // Prefill from API
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await api.get(`/api/recipes/${id}`);
        if (!alive) return;

        const r = res.data || {};
        setForm({
          name: r.name || "",
          description: r.description || "",
          kernel_type: r.kernel_type || "Butterfly",
          yield: String(r.yield || "1"),
          ingredients: r.ingredients || "",
          instructions: r.instructions || "",
          published: !!r.published,
        });
      } catch (e) {
        if (!alive) return;
        console.error("Error loading recipe", e);
        setError("Unable to load recipe for editing.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [id]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTogglePublished = () => {
    setForm((prev) => ({ ...prev, published: !prev.published }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Recipe title is required.");
      return;
    }
    if (!form.ingredients.trim()) {
      setError("Please add at least one ingredient.");
      return;
    }
    if (!form.instructions.trim()) {
      setError("Please add at least one instruction step.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      kernel_type: form.kernel_type,
      yield: form.yield || "1",
      ingredients: form.ingredients,
      instructions: form.instructions,
      // 🔑 only send published; NO visibility key
      published: form.published,
    };

    try {
      setSaving(true);
      await api.put(`/api/recipes/${id}`, payload);
      history.push(`/recipes/${id}`);
    } catch (e) {
      console.error("Error updating recipe", e);
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Unable to update recipe.";
      setError(msg);
      setSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push(`/recipes/${id}`);
  };

  if (loading) {
    return (
      <div className="recipeEditPage">
        <div className="recipeEditCard">Loading recipe…</div>
      </div>
    );
  }

  return (
    <div className="recipeEditPage">
      <form className="recipeEditCard" onSubmit={handleSubmit}>
        {/* HEADER */}
        <header className="recipeEditHeader">
          <div>
            <h1 className="recipeEditTitle">Edit Recipe</h1>
            <p className="recipeEditSubtitle">
              Update details or change whether it&apos;s shared with the Doberpop
              community.
            </p>
          </div>

          <div className="recipeEditToggleRow">
            <span className="recipeEditToggleLabel">
              Visible to Doberpop community
            </span>
            <button
              type="button"
              className={
                "rcToggle" + (form.published ? " rcToggle--on" : "")
              }
              onClick={handleTogglePublished}
            >
              <span className="rcToggleThumb" />
            </button>
          </div>
        </header>

        {error && <div className="recipeEditError">{error}</div>}

        {/* BASICS */}
        <section className="recipeEditSection">
          <h2 className="recipeEditSectionTitle">Basics</h2>
          <div className="recipeEditGrid">
            <div className="rcFieldGroup">
              <label className="rcLabel">Recipe title</label>
              <input
                className="rcInput"
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="e.g. Buffalo Ranch Crunch"
              />
            </div>

            <div className="rcFieldGroup">
              <label className="rcLabel">Description</label>
              <textarea
                className="rcTextarea"
                rows={3}
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Short description of this recipe…"
              />
            </div>

            <div className="rcFieldRow">
              <div className="rcFieldGroup">
                <label className="rcLabel">Kernel profile</label>
                <select
                  className="rcSelect"
                  value={form.kernel_type}
                  onChange={handleChange("kernel_type")}
                >
                  {KERNEL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rcFieldGroup rcFieldGroup--sm">
                <label className="rcLabel">Yield (cups)</label>
                <input
                  className="rcInput rcInput--inline rcInput--mini"
                  type="number"
                  min="1"
                  value={form.yield}
                  onChange={handleChange("yield")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* INGREDIENTS */}
        <section className="recipeEditSection">
          <h2 className="recipeEditSectionTitle">Ingredients</h2>
          <p className="recipeEditHint">
            For now this is a freeform field. Use any format that&apos;s easy
            for you (one per line, bullet-style, etc.).
          </p>
          <textarea
            className="rcTextarea rcTextarea--large"
            rows={5}
            value={form.ingredients}
            onChange={handleChange("ingredients")}
          />
        </section>

        {/* INSTRUCTIONS */}
        <section className="recipeEditSection">
          <h2 className="recipeEditSectionTitle">Instructions</h2>
          <textarea
            className="rcTextarea rcTextarea--large"
            rows={6}
            value={form.instructions}
            onChange={handleChange("instructions")}
            placeholder={
              "Step 1: …\nStep 2: …\n\nUse any style you like – numbered, bullet, etc."
            }
          />
        </section>

        {/* FOOTER */}
        <footer className="recipeEditFooter">
          <button
            type="button"
            className="rcBtn rcBtn--ghost"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rcBtn rcBtn--primary"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </footer>
      </form>
    </div>
  );
}