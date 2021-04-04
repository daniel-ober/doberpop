import React from 'react'
import { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { getAllIngredients } from '../services/ingredients'

export default function MainContainer() {
    const [ingredients, setIngredients] = useState([]);

    
    useEffect(() => {
        const fetchIngredients = async () => {
            const ingredientData = await getAllIngredients();
            setIngredients(ingredientData);
        }
        fetchIngredients();
    }, [])

    return (
        <Switch>
            <Route path='/ingredients'>
                <h2>Ingredients</h2>
                {/* <Ingredients 
                    ingredients={ingredients}
                /> */}
            </Route>
            <Route path='/recipes'>
                <h2>My Recipes</h2>
            </Route>
        </Switch>
    )
}
