import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

export default function RecipeEdit(props) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        kernel_type: '',
        ingredients: [],
        yield: '',
        instructions: '',
    })
    const {name, description, kernel_type, instructions} = formData;
    const { id } = useParams();
    const { recipes } = props;
    const { setIngredient } = props;

    useEffect(() => {
        const prefillFormData = () => {
            const recipeItem = recipes.find(recipe => recipe.id === Number(id));
            setFormData({
                name: recipeItem.name,
                description: recipeItem.description, 
                kernel_type: recipeItem.kernel_type, 
                yield: recipeItem.yield,
                instructions: recipeItem.instructions,
            })
        }
        prefillFormData()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            // handleEdit(formData);
        }}>
            <h2>Edit Recipe</h2>
            <label>
            <input
                type='text'
                name='name'
                placeholder='Recipe Title'
                value={name}
                onChange={handleChange}
            />
            <br/>
            <input
                type='text'
                name='description'
                placeholder='Description'
                value={description}
                onChange={handleChange}
            />
            <br/>
            <input
                type='text'
                name='kernel_type'
                placeholder='Kernel Profile'
                value={kernel_type}
                onChange={handleChange}
            />
            <br/>
            <input
                type='text'
                name='ingredients'
                placeholder='Ingredients'
                onChange={(e) => setIngredient({name:e.target.value})}
            />
            <br/>
            <input
                type='number'
                name='yield'
                placeholder='Yield'
                value={formData.yield}
                onChange={handleChange}
            />
            <br/>
            <input
                type='text'
                name='instructions'
                placeholder='Instructions'
                value={instructions}
                onChange={handleChange}
            />
            </label>
            <br/>
            <button>Cancel</button>
            <br/>
            <button>Add</button>
        </form>
    )
}
