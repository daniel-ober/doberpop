import React from "react";
import { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { getAllIngredients } from "../services/ingredients";
import {
  destroyRecipe,
  getAllRecipes,
  postRecipe,
  putRecipe,
} from "../services/recipes";
import Ingredients from "../screens/Ingredients";
import Recipes from "../screens/Recipes";
import RecipeCreate from "../screens/RecipeCreate";
import RecipeEdit from "../screens/RecipeEdit";
import RecipeDetails from "../screens/RecipeDetails";
import UserHome from "../screens/UserHome";

export default function MainContainer(props) {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  // const [ingredient, setIngredient] = useState({ name: "" });
  const { currentUser } = props;
  const history = useHistory();

  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientData = await getAllIngredients();
      setIngredients(ingredientData);
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipeData = await getAllRecipes();
      setRecipes(recipeData);
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    await destroyRecipe(id);
    setRecipes((prevState) => prevState.filter((recipe) => recipe.id !== id));
  };

  const handleCreate = async (recipeData) => {
    const newRecipe = await postRecipe(recipeData);
    setRecipes((prevState) => [...prevState, newRecipe]);
    history.push("/recipes");
  };

  const handleUpdate = async (id, recipeData) => {
    const updatedRecipe = await putRecipe(id, recipeData);
    setRecipes((prevState) =>
      prevState.map((recipe) => {
        return recipe.id === Number(id) ? updatedRecipe : recipe;
      })
    );
    history.push("/recipes");
  };

  return (
    <Switch>
      <Route path="/ingredients">
        <Ingredients ingredients={ingredients} />
      </Route>
      <Route path="/recipes/new">
        <RecipeCreate
          handleCreate={handleCreate}
          // setIngredient={setIngredient}
        />
      </Route>
      <Route path="/recipes/:id/edit">
        <RecipeEdit
          recipes={recipes}
          handleUpdate={handleUpdate}
          // setIngredient={setIngredient}
        />
      </Route>
      <Route path="/recipes/:id">
        <RecipeDetails />
      </Route>
      <Route path="/recipes">
        <Recipes
          recipes={recipes}
          handleDelete={handleDelete}
          currentUser={currentUser}
        />
      </Route>
      <Route path="/home">
        <UserHome currentUser={currentUser} />
      </Route>
    </Switch>
  );
}
