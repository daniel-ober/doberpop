import React from 'react'
import { useState, useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { getAllIngredients } from '../services/ingredients'
import { destroyRecipe, getAllRecipes, postRecipe } from '../services/recipes'
import Ingredients from '../screens/Ingredients'
import Recipes from '../screens/Recipes'
import RecipeCreate from '../screens/RecipeCreate'
import RecipeEdit from '../screens/RecipeEdit'

export default function MainContainer(props) {
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [ingredient, setIngredient] = useState({name:''});
    const history = useHistory();
    const { currentUser } = props;
    
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

    const handleCreate = async (recipeData) => {
        const newRecipe = await postRecipe({...recipeData, ingredients:[ingredient]});
        setRecipes(prevState => [...prevState, newRecipe]);
        history.push('/recipes');
    }
    

    return (
        <Switch>
            <Route path='/ingredients'>
                <Ingredients 
                    ingredients={ingredients}
                />
            </Route>
            <Route path='/recipes/new'>
                <RecipeCreate 
                    handleCreate={handleCreate}
                    setIngredient={setIngredient}
                />
            </Route>
            <Route path='/recipes/:id/edit'>
                <RecipeEdit 
                recipes={recipes}
                />
            </Route>
            <Route path='/recipes'>
                <Recipes 
                    recipes={recipes}
                    handleDelete={handleDelete}
                    currentUser={currentUser}
                />
            </Route>
        </Switch>
    )
}
