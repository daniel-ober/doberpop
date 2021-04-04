import React from 'react'

export default function Recipes(props) {
    const { recipes } = props;
    return (
        <div>
            <h2>Recipes</h2>
            {
                recipes.map(recipe => (
                    <p key={recipe.id}>{recipe.name}</p>
                ))
            }
        </div>
    )
}
