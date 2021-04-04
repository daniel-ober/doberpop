import React from 'react'

export default function Ingredients(props) {
    const { ingredients } = props;
    return (
        <div>
            <h2>Ingredients</h2>
            {
                ingredients.map(ingredient => (
                    <p key={ingredient.id}>{ingredient.name}</p>
                ))
            }
        </div>
    )
}
