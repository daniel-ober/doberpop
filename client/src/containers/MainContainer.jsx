import React, { useEffect, useMemo, useState } from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";

import Recipes from "../pages/Recipes/Recipes";
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import RecipeCreate from "../pages/RecipeCreate/RecipeCreate";
import RecipeEdit from "../pages/RecipeEdit/RecipeEdit";

import { getRecipesWithMeta, deleteRecipe } from "../services/recipes";

import "./MainContainer.css";

function MainContainer({ currentUser }) {
  const [recipes, setRecipes] = useState([]);
  const [totalSignatureCount, setTotalSignatureCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { path } = useRouteMatch();

  const loadRecipes = async () => {
    try {
      setLoading(true);

      const result = await getRecipesWithMeta();
      const allRecipes = Array.isArray(result?.recipes) ? result.recipes : [];

      setRecipes(allRecipes);
      setTotalSignatureCount(
        typeof result?.totalSignatureCount === "number"
          ? result.totalSignatureCount
          : allRecipes.filter((r) => r.source === "doberpop").length
      );
    } catch (e) {
      console.error("MAINCONTAINER: loadRecipes failed =", e);
      setRecipes([]);
      setTotalSignatureCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      await loadRecipes();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const samplerRecipes = useMemo(() => {
    return [...recipes]
      .filter((r) => r.source === "doberpop" && r.show_in_sampler === true)
      .sort((a, b) => {
        const aPos =
          typeof a.sampler_position === "number" ? a.sampler_position : 9999;
        const bPos =
          typeof b.sampler_position === "number" ? b.sampler_position : 9999;
        return aPos - bPos;
      });
  }, [recipes]);

  const isAuthed = !!currentUser;

  return (
    <div className="mainContainer">
      <Switch>
        <Route exact path={path}>
          <Recipes
            recipes={recipes}
            samplerRecipes={samplerRecipes}
            handleDelete={handleDelete}
            currentUser={currentUser}
            loading={loading}
            totalSignatureCount={totalSignatureCount}
          />
        </Route>

        <Route exact path={`${path}/new`}>
          {isAuthed ? (
            <RecipeCreate
              currentUser={currentUser}
              onSubmitSuccess={loadRecipes}
            />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        <Route exact path={`${path}/:id/edit`}>
          {isAuthed ? (
            <RecipeEdit
              currentUser={currentUser}
              onSubmitSuccess={loadRecipes}
            />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        <Route path={`${path}/:id`}>
          <RecipeDetails currentUser={currentUser} />
        </Route>
      </Switch>
    </div>
  );
}

export default MainContainer;