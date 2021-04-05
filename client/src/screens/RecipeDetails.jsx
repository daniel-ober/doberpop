import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOneRecipe } from '../services/recipes'

export default function RecipeDetails() {
    const [recipeItem, setRecipeItem] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchRecipeItem = async () => {
            const recipeData = await getOneRecipe(id)
            setRecipeItem(recipeData);
        }
        fetchRecipeItem()
    }, [])

    return (
        <div>
            <h2>{recipeItem?.name}</h2>
            <br/>
            <br/>
            Description: 
            <br/>{recipeItem?.description}
            <br/>
            <br/>
            Kernel Profile: 
            <br/>{recipeItem?.kernel_type}
            <br/>
            <br/>
            Ingredients: 
            <br/>{recipeItem?.ingredients.map(ingredient => (
                <p key={ingredient.id}>{ingredient.name}</p>
            ))}
            <br/>
            <br/>
            Yield (cups): 
            <br/>{recipeItem?.yield}
            <br/>
            <br/>
            Instructions:
            <br/>{recipeItem?.instructions}
        </div>
    )
}

// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import Modal from '../components/Modal';
// import { useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { getOneRecipe } from '../services/recipes'

//     const [recipeItem, setRecipeItem] = useState(null);
//     const { id } = useParams();

//     useEffect(() => {
//         const fetchRecipeItem = async () => {
//             const recipeData = await getOneRecipe(id)
//             setRecipeItem(recipeData);
//         }
//         fetchRecipeItem()
//     }, [])

// export default function Recipes(props) {
//     const [open, handleOpen] = useState(false)
//     const { recipes, handleDelete, currentUser } = props;

//     return (
//         <div>
//             <h2>{recipeItem?.name}</h2>
//             {
//                 recipes.map(recipe => (
//                 <React.Fragment key={recipe.id}>
//                     <Link to={`/recipes/${recipe.id}`}><p>{recipe.name}</p></Link>
//                     {
//                         currentUser?.id === recipe.user_id &&
//                         <>
//                     <Link to={`/recipes/${recipe.id}`}><button>Back</button></Link>
//                     <Link to={`/recipes/${recipe.id}/edit`}><button>Edit</button></Link>
//                     <button onClick={() => handleOpen(recipe.id)}>DELETE RECIPE</button>
//                         </>
//                     }
//                 </React.Fragment>
//                 ))
//             }
//             <br />
//             {open && (
//                 <Modal 
//                 open={open}
//                 handleOpen={handleOpen}
//                 handleDelete={handleDelete}
//                 />
//             )}
//             <br/>
//             <Link to='/recipes/new'>
//                 <button>Add New Recipe</button>
//             </Link>
//         </div>
//     )
// }
