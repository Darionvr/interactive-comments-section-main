import React from 'react'
import data from "../../data.json"

const Form = ({change, submit, text, value}) => {
    return (

        <form className="add-comment" onSubmit={submit}>
            <img className='your-avatar' src={data.currentUser.image.png} alt="Your Avatar" />
            <textarea
                placeholder='Add a comment ....'
                value={value}
                onChange={change}
            />
            <button className='send'  >  {text} </button>
        </form>
    )
}

export default Form