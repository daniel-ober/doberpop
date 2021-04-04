import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal';

export default function Recipes(props) {
    const [open, handleOpen] = useState(false)
    const { recipes, handleDelete } = props;
    return (
        <div>
            <h2>Recipes</h2>
            {
                recipes.map(recipe => (
                    <>
                    <p key={recipe.id}>{recipe.name}</p>
                    <button onClick={() => handleOpen(recipe.id)}>DELETE RECIPE</button>
                    </>
                ))
            }
            {open && (
                <Modal 
                open={open}
                handleOpen={handleOpen}
                handleDelete={handleDelete}
                />
            )}
            <br/>
            <Link to='/recipes/new'>
                <button>Add New Recipe</button>
            </Link>
        </div>
    )
}
