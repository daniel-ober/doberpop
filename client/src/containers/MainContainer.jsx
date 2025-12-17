import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";

import Recipes from "../pages/Recipes/Recipes";
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import RecipeCreate from "../pages/RecipeCreate/RecipeCreate";
import RecipeEdit from "../pages/RecipeEdit/RecipeEdit";

import { getRecipes, deleteRecipe } from "../services/recipes";

export default function MainContainer({ currentUser }) {
  const { path } = useRouteMatch(); // <-- IMPORTANT (nested router base)
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Switch>
      {/* IMPORTANT: put /new and /:id/edit BEFORE /:id */}
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
        <Recipes
          recipes={recipes}
          handleDelete={handleDelete}
          currentUser={currentUser}
        />
      </Route>
    </Switch>
  );
}