import {useState} from 'react'

export default function RecipeCreate() {
    const [formData, setFormData] = useState({
        name: ''
    })
    const {name, description, kernel_type,ingredients, total_cups, instructions} = formData;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            // [description]: value,
            // [kernel_type]: value,
            // [ingredients]: value,
            // [total_cups]: value,
            // [instructions]: value,
        }))
    }

    return (
        <form>
            <h2>New Recipe</h2>
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
                name='name'
                placeholder='Recipe Title'
                value={name}
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
                type='text'
                name='yield'
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
            <br/>
            <button>Cancel</button>
            <br/>
            <button>Add</button>
        </form>
    )
}
