import {useState} from 'react'

export default function RecipeCreate() {
    const [formData, setFormData] = useState({
        name: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            name: value,
            description: value,
            kernel_type: value,
            ingredients: value,
            yield: value,
            instructions: value,
        }))
    }

    return (
        <form>
            <label>
                <input
                type='text'
                name='username'
                placeholder='username'
                value={username}
                onChange={handleChange}
            />
            <br/>
            </label>
            <button>Cancel</button>
            <br/>
            <button>Add</button>
        </form>
    )
}
