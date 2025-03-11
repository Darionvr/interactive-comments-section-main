import React from 'react'

export const MyUserIcons = ({click}) => {
    return (
        <div className='my-user-icons'>
            <p className='delete' onClick={click}><img src="images/icon-delete.svg" alt="Delete icon" /> Delete</p>
            <p className='edit'><img src="images/icon-edit.svg" alt="Edit icon" /> Edit</p>
        </div>
    )
}
