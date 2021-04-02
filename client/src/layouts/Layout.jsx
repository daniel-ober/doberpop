import React from 'react'
import './Layout.css'
import { Link } from 'react-router-dom'

export default function Layout(props) {
    const {currentUser} = props;
    return (
        <div>
            <header>
            <Link to='/'><img src='https://i.imgur.com/Hj8iyBo.png?1' alt='logo' /></Link>
            {
                currentUser ?
                <>
                <div class="dropdown">
                    <img src='https://i.imgur.com/D5khdnp.png?3' onclick="myFunction()" class="dropbtn" alt='user'/>
                    <div id="myDropdown" class="dropdown-content">
                        <Link to='/recipes'>My Recipes</Link>
                        <Link to='/ideas'>Tastemaster Ideas</Link>
                        <Link to='/community'>Community</Link>
                        <Link to='/logout'>Logout</Link>
                    </div>
                </div>
                </>
                :
                <Link to='/login'>Login/Register</Link>
            }
            </header>
            <hr/>
            {currentUser && (
            <>
            <h3>Hello, {currentUser.username}!</h3>
            <br/>
            <p>Click the yellow avatar icon in the top right corner  to navigate around the site</p>
            </>
            )}
            {props.children}
        </div>
    )
}
