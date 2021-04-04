import React from 'react'

export default function Modal(props) {
    const { open, handleOpen, handleDelete } = props;
    return (
        <div className='modal'>
            <p>Are you sure?</p>
            <button onClick={()=>handleOpen(false)}>no</button>
            <button onClick={()=> {
                handleDelete(open)
                handleOpen(false)
            }}>yes</button>
        </div>
    )
}
