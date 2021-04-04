import React from 'react'

export default function Ingredients(props) {
    const { ingredients } = props;
    return (
        <div>
            <h2>Ingredients</h2>
            {
                ingredients.map(ingredient => (
                    <p>{ingredient.name}</p>
                ))
            }
        </div>
    )
}
