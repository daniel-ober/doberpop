import {useState} from 'react'

export default function RecipeEdit(props) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        kernel_type: '',
        ingredients: '',
        yield: '',
        instructions: '',
    })
    const { name, description, kernel_type,ingredients, total_cups, instructions } = formData;
    // const { handleCreate } = props;

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
            handleCreate(formData);
        }}>
            <h2>New Recipe</h2>
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
                value={ingredients}
                onChange={handleChange}
            />
            <br/>
            <input
                type='number'
                name='total_cups'
                placeholder='Yield'
                value={total_cups}
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
