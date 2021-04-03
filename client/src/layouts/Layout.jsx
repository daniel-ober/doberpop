import React from 'react'
import './Layout.css'
import { Link } from 'react-router-dom'

export default function Layout(props) {
    const {currentUser, handleLogout} = props;

    return (
        <div class='main-container'>
            <header>
            <Link to='/'><img src='https://i.imgur.com/Hj8iyBo.png?1' alt='logo' /></Link>
            {
                currentUser ?
                <>
                <div>
                <p>{currentUser.username}</p>
                <Link to='/recipes'>My Recipes</Link>
                <br/>
                <Link to='/ideas'>Tastemaster Ideas</Link>
                <br/>
                <Link to='/community'>Community</Link>
                <br/>
                <Link onClick={handleLogout}>Logout</Link>
                <br/>
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
