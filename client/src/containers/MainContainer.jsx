import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";

import Recipes from "../pages/Recipes/Recipes";
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import RecipeCreate from "../pages/RecipeCreate/RecipeCreate";
import RecipeEdit from "../pages/RecipeEdit/RecipeEdit";

import { getRecipes, deleteRecipe } from "../services/recipes";

export default function MainContainer({ currentUser }) {
  const { path } = useRouteMatch();
  const [recipes, setRecipes] = useState([]);
  const [recipesError, setRecipesError] = useState("");
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setRecipesError("");
        setLoadingRecipes(true);

        const data = await getRecipes();

        if (!alive) return;

        // ✅ handle both: [ ... ] OR { recipes: [ ... ] }
        const list = Array.isArray(data) ? data : data?.recipes || [];
        setRecipes(list);
      } catch (e) {
        if (!alive) return;
        setRecipes([]);
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

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Switch>
      <Route exact path={`${path}/new`}>
        <RecipeCreate />
      </Route>

      <Route exact path={`${path}/:id/edit`}>
        <RecipeEdit />
      </Route>

      <Route exact path={`${path}/:id`}>
        <RecipeDetails />
      </Route>

      <Route exact path={path}>
        {loadingRecipes ? (
          <div style={{ padding: 24, opacity: 0.85 }}>Loading recipes…</div>
        ) : recipesError ? (
          <div style={{ padding: 24, color: "salmon" }}>{recipesError}</div>
        ) : (
          <Recipes
            recipes={recipes}
            handleDelete={handleDelete}
            currentUser={currentUser}
          />
        )}
      </Route>
    </Switch>
  );
}