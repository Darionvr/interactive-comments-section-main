import React, { useContext } from 'react'
import { ModalContext } from '../context/ModalContext'


const Modal = ({clickNo, text, clickYes}) => {

   


    return (

        <div className="modal">
            <div className="delete-card">
                <p>Delete {text}</p>
                <p>Are you sure you want to delete this {text}? This will remove the comment and can't be undone.</p>
                <div className="delete-buttons">
                    <button onClick={clickNo} className='no-cancel'>NO, CANCEL</button>
                    <button onClick={clickYes} className='yes-delete'>YES, DELETE</button>
                </div>
            </div>
        </div>
    )
}

export default Modal