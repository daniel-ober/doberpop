import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout(props) {
    const {currentUser, handleLogout} = props;

    return (
        <body>
        <div class='main-container'>
            <header>
            <Link to='/landing'><img className='header-logo' src='https://i.imgur.com/Hj8iyBo.png?1' alt='logo' /></Link>
            {
                currentUser ?
                <>
                <div>
                <p>{currentUser.username}</p>
                <Link to='/recipes'>Recipes</Link>
                <br/>
                <Link to='/ingredients'>Ingredients</Link>
                <br/>
                <Link onClick={handleLogout}>Logout</Link>
                <br/>
                </div>
                </>
                :
                null
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
    </body>
    )
}
