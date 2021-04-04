import { useState } from 'react'
import {Link} from 'react-router-dom'

export default function Login(props) {
    const [formData, setFormData] = useState ({
        username: '',
        password: '',
        isError: false,
        errorMsg: '',
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
            <img className='login-logo' src='https://i.imgur.com/Hj8iyBo.png' alt='logo'/>
            <br/>
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
            <button>Login</button>
            <br/>
            Dont have an account? 
            <br/>
            <Link to='/register'>Register</Link>
            <br/>
        </form>
    )
}