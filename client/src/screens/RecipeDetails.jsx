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
    }, [id])

    return (
        <div>
            <h2>{recipeItem?.name}</h2>
            {recipeItem?.ingredients.map(ingredient => (
                <p key={ingredient.id}>{ingredient.name}</p>
            ))}
            
        </div>
    )
}
