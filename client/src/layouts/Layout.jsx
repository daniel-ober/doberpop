import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout(props) {
    return (
        <div>
            <header>
            <h1>doberpop</h1>
            <Link to='/login'>Login/Register</Link>
            </header>
            <hr/>
            {props.children}
        </div>
    )
}
