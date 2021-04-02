import { useState } from 'react'
import {Link} from 'react-router-dom'

export default function Login(props) {
    const [formData, setFormData] = useState ({
        username: '',
        password: ''
    })

    const {username, password} = formData;
    const {handleLogin} = props;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin(formData);
        }}>
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
                type='password'
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