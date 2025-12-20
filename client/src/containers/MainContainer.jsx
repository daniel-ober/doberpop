// client/src/containers/MainContainer.jsx
import React, { useEffect, useState } from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";

import Recipes from "../pages/Recipes/Recipes";
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import RecipeCreate from "../pages/RecipeCreate/RecipeCreate";
import RecipeEdit from "../pages/RecipeEdit/RecipeEdit";

import { getAllRecipes, deleteRecipe } from "../services/recipes";

function MainContainer({ currentUser }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { path } = useRouteMatch();

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (e) {
      setRecipes([]);
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
      // optional: toast/log
    }
  };

  if (!currentUser) {
    // extra guard; App already redirects, but this keeps it safe
    return <Redirect to="/login" />;
  }

  return (
    <Switch>
      {/* Recipes index */}
      <Route exact path={path}>
        <Recipes
          recipes={recipes}
          handleDelete={handleDelete}
          currentUser={currentUser}
          loading={loading}
        />
      </Route>

      {/* New recipe */}
      <Route exact path={`${path}/new`}>
        <RecipeCreate currentUser={currentUser} onSubmitSuccess={loadRecipes} />
      </Route>

      {/* Edit recipe */}
      <Route exact path={`${path}/:id/edit`}>
        <RecipeEdit currentUser={currentUser} onSubmitSuccess={loadRecipes} />
      </Route>

      {/* Recipe details (gets currentUser for favorites pill) */}
      <Route path={`${path}/:id`}>
        <RecipeDetails currentUser={currentUser} />
      </Route>
    </Switch>
  );
}

export default MainContainer;