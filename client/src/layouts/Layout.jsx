import React from 'react'

export default function Layout(props) {
    return (
        <div>
            <header>
            <h1>doberpop</h1>
            </header>
            {props.children}
        </div>
    )
}
