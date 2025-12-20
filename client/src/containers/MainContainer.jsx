// client/src/containers/MainContainer.jsx
import React, { useEffect, useState } from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";

import Recipes from "../pages/Recipes/Recipes";
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import RecipeCreate from "../pages/RecipeCreate/RecipeCreate";
import RecipeEdit from "../pages/RecipeEdit/RecipeEdit";

import { getAllRecipes, deleteRecipe } from "../services/recipes";

// 🔥 bring in dedicated styling
import "./MainContainer.css";

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

  const isAuthed = !!currentUser;

  return (
    <div className="mainContainer">
      <Switch>
        {/* Recipes index – public */}
        <Route exact path={path}>
          <Recipes
            recipes={recipes}
            handleDelete={handleDelete}
            currentUser={currentUser}
            loading={loading}
          />
        </Route>

        {/* New recipe – auth only */}
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

        {/* Edit recipe – auth only */}
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

        {/* Recipe details – public */}
        <Route path={`${path}/:id`}>
          <RecipeDetails currentUser={currentUser} />
        </Route>
      </Switch>
    </div>
  );
}

export default MainContainer;