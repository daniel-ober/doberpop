import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal';

export default function Recipes(props) {
    const [open, handleOpen] = useState(false)
    const { recipes, handleDelete, currentUser } = props;

    return (
        <div>
            <h2>Recipes</h2>
            {
                recipes.map(recipe => (
                <>
                    <p key={recipe.id}>{recipe.name}</p>
                    {
                        currentUser?.id === recipe.user_id &&
                        <>
                    <Link to={`/recipes/${recipe.id}`}><button>Back</button></Link>
                    <Link to={`/recipes/${recipe.id}/edit`}><button>Edit</button></Link>
                    <button onClick={() => handleOpen(recipe.id)}>DELETE RECIPE</button>
                        </>
                    }
                </>
                ))
            }
            <br />
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
