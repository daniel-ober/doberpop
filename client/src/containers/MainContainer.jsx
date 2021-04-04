import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllIngredients } from '../services/ingredients'

export default function MainContainer(props) {
    const [ingredients, setIngredients] = useState([]);
    const {currentUser} = props;

    
    useEffect(() => {
        const fetchIngredients = async () => {
            const ingredientData = await getAllIngredients()
            setIngredients(ingredientData)
        }
        fetchIngredients();
    })

    return (
        <Switch>
            {/* <Route path='/home'>
            <div>
                {currentUser && (
            <>
                <h3>Hello, {currentUser.username}!</h3>
            <br/>
                <p>Click the yellow avatar icon in the top right corner  to navigate around the site</p>
            </>
            )}
            {props.children}
        </div>
            </Route> */}
            <Route path='/recipes'>
                <h2>My Recipes</h2>
            </Route>
            <Route path='/ingredients'>
                <h2>Ingredients</h2>
            </Route>
        </Switch>
    )
}
