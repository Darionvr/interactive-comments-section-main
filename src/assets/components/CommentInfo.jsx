import React, { useContext } from 'react'
import { CommentContext } from '../context/CommentContext'



const CommentInfo = ({comment}) => {

const {myUser} = useContext(CommentContext)
    return (

        <div className="comment-info">
            <img className='user-avatar' src={comment.user.image.png} alt="user avatar" />
            <p className='user-name'>{comment.user.username}</p>
            {comment.user.username === myUser.username ? <p className='you'> You </p> : ''}
            <p>{comment.createdAt}</p>

        </div>
    )
}

export default CommentInfo