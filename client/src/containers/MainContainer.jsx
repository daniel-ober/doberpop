import React from 'react'
import { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { getAllIngredients } from '../services/ingredients'
import { destroyRecipe, getAllRecipes } from '../services/recipes'
import Ingredients from '../screens/Ingredients'
import Recipes from '../screens/Recipes'
import RecipeCreate from '../screens/RecipeCreate'

export default function MainContainer() {
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    
    useEffect(() => {
        const fetchIngredients = async () => {
            const ingredientData = await getAllIngredients();
            setIngredients(ingredientData);
        }
        fetchIngredients();
    }, [])

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipeData = await getAllRecipes();
            setRecipes(recipeData);
        }
        fetchRecipes();
    }, [])

    const handleDelete = async (id) => {
        await destroyRecipe(id);
        setRecipes(prevState => prevState.filter(recipe => recipe.id !== id))
      }
    

    return (
        <Switch>
            <Route path='/ingredients'>
                <Ingredients 
                    ingredients={ingredients}
                />
            </Route>
            <Route path='/recipes/new'>
                <RecipeCreate />
            </Route>
            <Route path='/recipes'>
                <Recipes 
                    recipes={recipes}
                    handleDelete={handleDelete}
                />
            </Route>
        </Switch>
    )
}
