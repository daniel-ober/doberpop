import {useState } from 'react'
import Modal from '../components/Modal';

export default function Recipes(props) {
    const [open, handleOpen] = useState(false)
    const { recipes } = props;
    return (
        <div>
            <h2>Recipes</h2>
            {
                recipes.map(recipe => (
                    <>
                    <p key={recipe.id}>{recipe.name}</p>
                    <button onClick={() => handleOpen(true)}>DELETE RECIPE</button>
                    </>
                ))
            }
            {open && (
                <Modal 
                handleOpen={handleOpen}
                />
            )}
        </div>
    )
}
