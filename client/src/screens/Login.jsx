import { useState } from 'react'
import {Link} from 'react-router-dom'

export default function Login() {
    const [formData, setFormData] = useState ({
        username: '',
        password: ''
    })

    const {username, password} = formData;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
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
            <input
                type='text'
                name='password'
                placeholder='password'
                value={password}
                onChange={handleChange}
            />
            </label>
            <br/>
            Dont have an account? 
            <br/>
            <Link>Register</Link>
            <br/>
            <button>Login</button>
        </form>
    )
}
