import { useState } from 'react'
import {Link} from 'react-router-dom'

export default function Register(props) {
    const [formData, setFormData] = useState ({
        username: '',
        email: '',
        password: ''
    })

    const {username, email, password} = formData;
    const {handleRegister} = props;

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
            handleRegister(formData);
        }}>
        <img src='https://i.imgur.com/Hj8iyBo.png' alt='logo' />
        <br/>
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
            name='email'
            placeholder='email'
            value={email}
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
        <br/>
        <button>Create Account</button>
        <br/>
        Already have an account? 
        <br/>
        <Link to='/login'>Sign In</Link>
        <br/>
    </form>
    )
}