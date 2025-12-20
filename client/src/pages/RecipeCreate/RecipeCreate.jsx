// client/src/pages/RecipeCreate/RecipeCreate.jsx
import React, { useState } from "react";
import "./RecipeCreate.css";
import api from "../../services/api-config";

/**
 * Local API helper – uses shared axios client with JWT interceptor.
 */
async function createRecipe(payload) {
  const res = await api.post("/api/recipes", payload);
  return res.data;
}

const KERNEL_OPTIONS = ["Butterfly", "Mushroom", "Mixed"];

const ESSENTIAL_INGREDIENTS = [
  "Mushroom popcorn kernels",
  "Butterfly popcorn kernels",
  "Unsalted butter",
  "Salted butter",
  "Coconut oil",
  "Canola oil",
  "Flavacol",
  "Kosher salt",
  "Sea salt",
  "Granulated sugar",
  "Brown sugar",
  "Vanilla extract",
];

const STARTER_STEPS = [
  "Pop the kernels until popping slows to 1–2 seconds between pops.",
  "Store leftovers in an airtight container at room temperature.",
];

export default function RecipeCreate() {
  // visibility
  const [isCommunityVisible, setIsCommunityVisible] = useState(false);

  // basics
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [kernelType, setKernelType] = useState("Butterfly");
  const [yieldCups, setYieldCups] = useState("1");

  // ingredients
  const [ingredients, setIngredients] = useState([]);
  const [selectedEssential, setSelectedEssential] = useState(
    ESSENTIAL_INGREDIENTS[0]
  );
  const [customIngredientName, setCustomIngredientName] = useState("");
  const [measurementQty, setMeasurementQty] = useState("1");
  const [measurementUnit, setMeasurementUnit] = useState("cups");
  const [measurementSystem, setMeasurementSystem] = useState("US");

  // instructions
  const [starterStep, setStarterStep] = useState(STARTER_STEPS[0]);
  const [customStep, setCustomStep] = useState("");
  const [instructionSteps, setInstructionSteps] = useState([]);

  // ui state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ------------- INGREDIENT HELPERS -------------
  const addIngredient = (name, type) => {
    if (!name.trim()) return;

    const ingredient = {
      id: Date.now() + Math.random(),
      name: name.trim(),
      type, // "essential" or "custom"
      qty: measurementQty || "1",
      unit: measurementUnit,
      system: measurementSystem,
    };

    setIngredients((prev) => [...prev, ingredient]);
  };

  const handleAddEssential = (e) => {
    e.preventDefault();
    addIngredient(selectedEssential, "essential");
  };

  const handleAddCustomIngredient = (e) => {
    e.preventDefault();
    addIngredient(customIngredientName, "custom");
    setCustomIngredientName("");
  };

  const handleRemoveIngredient = (id) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  // ------------- INSTRUCTION HELPERS -------------
  const handleAddStarterStep = (e) => {
    e.preventDefault();
    if (!starterStep.trim()) return;

    setInstructionSteps((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text: starterStep.trim() },
    ]);
  };

  const handleAddCustomStep = (e) => {
    e.preventDefault();
    if (!customStep.trim()) return;

    setInstructionSteps((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text: customStep.trim() },
    ]);
    setCustomStep("");
  };

  const handleRemoveStep = (id) => {
    setInstructionSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const moveStep = (index, delta) => {
    setInstructionSteps((prev) => {
      const arr = [...prev];
      const newIndex = index + delta;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      const [moved] = arr.splice(index, 1);
      arr.splice(newIndex, 0, moved);
      return arr;
    });
  };

  // ------------- SUBMIT -------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Recipe title is required.");
      return;
    }
    if (!ingredients.length) {
      setError("Please add at least one ingredient.");
      return;
    }
    if (!instructionSteps.length) {
      setError("Please add at least one instruction step.");
      return;
    }

    const ingredientsSummary = ingredients
      .map(
        (ing) =>
          `${ing.qty} ${ing.unit} ${ing.name}${
            ing.system && ing.system !== "US" ? ` (${ing.system})` : ""
          }`
      )
      .join(", ");

    const instructionsSummary = instructionSteps
      .map((step, idx) => `Step ${idx + 1}: ${step.text}`)
      .join("\n");

    const payload = {
      name: name.trim(),
      description: description.trim(),
      kernel_type: kernelType,
      yield: yieldCups || "1",
      ingredients: ingredientsSummary,
      instructions: instructionsSummary,
      // publish only when shared to community
      published: isCommunityVisible,
      source: "user",
    };

    try {
      setSaving(true);
      await createRecipe(payload);
      window.location.href = "/recipes";
    } catch (err) {
      console.error("Error creating recipe", err);
      setError(err?.message || "Unable to create recipe.");
      setSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    window.location.href = "/recipes";
  };

  // ------------- RENDER -------------
  return (
    <div className="recipeCreatePage">
      <form className="recipeCreateCard" onSubmit={handleSubmit}>
        {/* HEADER */}
        <header className="recipeCreateHeader">
          <div>
            <h1 className="recipeCreateTitle">New Recipe</h1>
            <p className="recipeCreateSubtitle">
              Build a new popcorn profile with reusable building blocks.
            </p>
          </div>

          {/* <div className="recipeCreateToggleRow">
            <span className="recipeCreateToggleLabel">
              Visible to Doberpop community
            </span>
            <button
              type="button"
              className={
                "rcToggle" + (isCommunityVisible ? " rcToggle--on" : "")
              }
              onClick={() => setIsCommunityVisible((v) => !v)}
            >
              <span className="rcToggleThumb" />
            </button>
          </div> */}
        </header>

        {error && <div className="recipeCreateError">{error}</div>}

        {/* BASICS */}
        <section className="recipeCreateSection">
          <h2 className="recipeCreateSectionTitle">Basics</h2>
          <div className="recipeCreateGrid">
            <div className="rcFieldGroup">
              <label className="rcLabel">Recipe title</label>
              <input
                className="rcInput"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Breakfast of Champions"
              />
            </div>

            <div className="rcFieldGroup">
              <label className="rcLabel">Description</label>
              <textarea
                className="rcTextarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A sweet/savory mashup with coffee-ready aroma."
              />
            </div>

            <div className="rcFieldRow">
              <div className="rcFieldGroup">
                <label className="rcLabel">Kernel profile</label>
                <select
                  className="rcSelect"
                  value={kernelType}
                  onChange={(e) => setKernelType(e.target.value)}
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
                  value={yieldCups}
                  onChange={(e) => setYieldCups(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* INGREDIENTS */}
        <section className="recipeCreateSection">
          <h2 className="recipeCreateSectionTitle">Ingredients</h2>

          <div className="recipeCreateSubsection">
            <div className="rcSubheader">
              <span className="rcLabel">Quick-add from essentials</span>
              <span className="rcHint">
                (Cannot edit the names of essential ingredients)
              </span>
            </div>
            <div className="rcFieldRow">
              <div className="rcFieldGroup">
                <select
                  className="rcSelect"
                  value={selectedEssential}
                  onChange={(e) => setSelectedEssential(e.target.value)}
                >
                  {ESSENTIAL_INGREDIENTS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="rcBtn"
                onClick={handleAddEssential}
              >
                Add
              </button>
            </div>
          </div>

          <div className="recipeCreateSubsection">
            <div className="rcSubheader">
              <span className="rcLabel">Add custom ingredient</span>
            </div>
            <div className="rcFieldRow">
              <div className="rcFieldGroup">
                <input
                  className="rcInput"
                  type="text"
                  value={customIngredientName}
                  onChange={(e) => setCustomIngredientName(e.target.value)}
                  placeholder="e.g. White cheddar powder"
                />
              </div>
              <button
                type="button"
                className="rcBtn rcBtn--ghost"
                onClick={handleAddCustomIngredient}
              >
                Add custom
              </button>
            </div>
          </div>

          {/* measurement controls */}
          <div className="recipeCreateSubsection">
            <div className="rcSubheader">
              <span className="rcLabel">Default measurement</span>
              <span className="rcHint">
                Applied when you add a new ingredient.
              </span>
            </div>
            <div className="rcFieldRow">
              <div className="rcFieldGroup rcFieldGroup--sm">
                <label className="rcLabel">Qty</label>
                <input
                  className="rcInput rcInput--inline rcInput--mini"
                  type="number"
                  min="0"
                  step="0.25"
                  value={measurementQty}
                  onChange={(e) => setMeasurementQty(e.target.value)}
                />
              </div>
              <div className="rcFieldGroup rcFieldGroup--sm">
                <label className="rcLabel">Unit</label>
                <select
                  className="rcSelect rcSelect--mini"
                  value={measurementUnit}
                  onChange={(e) => setMeasurementUnit(e.target.value)}
                >
                  <option value="cups">cups</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                </select>
              </div>
              <div className="rcFieldGroup rcFieldGroup--sm">
                <label className="rcLabel">System</label>
                <select
                  className="rcSelect rcSelect--mini"
                  value={measurementSystem}
                  onChange={(e) => setMeasurementSystem(e.target.value)}
                >
                  <option value="US">US</option>
                  <option value="Metric">Metric</option>
                  <option value="UK">UK</option>
                </select>
              </div>
            </div>
          </div>

          {/* ingredient list */}
          <ul className="rcList rcList--ingredients">
            {ingredients.map((ing) => (
              <li key={ing.id} className="rcIngredientRow">
                <div className="rcIngredientNameBlock">
                  <span className="rcPill">
                    {ing.type === "essential" ? "Essential" : "Custom"}
                  </span>
                  <span
                    className={
                      "rcIngredientName" +
                      (ing.type === "essential"
                        ? " rcIngredientName--locked"
                        : "")
                    }
                  >
                    {ing.name}
                  </span>
                </div>
                <div className="rcIngredientInputs">
                  <span className="rcPill">
                    {ing.qty} {ing.unit}
                  </span>
                  <span className="rcPill">{ing.system}</span>
                  <button
                    type="button"
                    className="rcBtn rcBtn--ghost"
                    onClick={() => handleRemoveIngredient(ing.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* INSTRUCTIONS */}
        <section className="recipeCreateSection">
          <h2 className="recipeCreateSectionTitle">Instructions</h2>

          <div className="recipeCreateSubsection">
            <div className="rcSubheader">
              <span className="rcLabel">Starter steps</span>
              <span className="rcHint">
                Add, then edit to match this specific recipe.
              </span>
            </div>
            <div className="rcFieldRow">
              <div className="rcFieldGroup">
                <select
                  className="rcSelect"
                  value={starterStep}
                  onChange={(e) => setStarterStep(e.target.value)}
                >
                  {STARTER_STEPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="rcBtn"
                onClick={handleAddStarterStep}
              >
                Add step
              </button>
            </div>
          </div>

          <div className="recipeCreateSubsection">
            <div className="rcSubheader">
              <span className="rcLabel">Add custom step</span>
            </div>
            <div className="rcFieldRow">
              <div className="rcFieldGroup">
                <input
                  className="rcInput"
                  type="text"
                  value={customStep}
                  onChange={(e) => setCustomStep(e.target.value)}
                  placeholder="e.g. Drizzle maple–bourbon glaze over the popcorn while tossing."
                />
              </div>
              <button
                type="button"
                className="rcBtn rcBtn--ghost"
                onClick={handleAddCustomStep}
              >
                Add custom
              </button>
            </div>
          </div>

          <ul className="rcList rcList--steps">
            {instructionSteps.map((step, index) => (
              <li key={step.id} className="rcStepRow">
                <div className="rcStepHandle">⋮⋮</div>
                <div className="rcStepContent">
                  <div className="rcStepHeader">
                    <span className="rcStepIndex">Step {index + 1}</span>
                    <div className="rcStepActions">
                      <button
                        type="button"
                        className="rcBtn rcBtn--ghost"
                        disabled={index === 0}
                        onClick={() => moveStep(index, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="rcBtn rcBtn--ghost"
                        disabled={index === instructionSteps.length - 1}
                        onClick={() => moveStep(index, 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="rcBtn rcBtn--ghost"
                        onClick={() => handleRemoveStep(step.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="rcTextarea rcTextarea--step"
                    rows={3}
                    value={step.text}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInstructionSteps((prev) =>
                        prev.map((s) =>
                          s.id === step.id ? { ...s, text: value } : s
                        )
                      );
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* FOOTER */}
        <footer className="recipeCreateFooter">
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
            {saving ? "Saving…" : "Save recipe"}
          </button>
        </footer>
      </form>
    </div>
  );
}