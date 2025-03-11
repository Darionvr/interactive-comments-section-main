import React, { useContext } from 'react'
import { CommentContext } from '../context/CommentContext'

const CommentScorer = ({comment}) => {

  const {comments, setComments} = useContext(CommentContext)

  const handleCommentScore = (commentId, increment) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          score: comment.score + increment,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  return (
    <div className='scorer'>
    <img onClick={() => handleCommentScore(comment.id, 1)} src="images/icon-plus.svg" alt="Plus" />
    
    <p className='score'> {comment.score} </p>
    <img onClick={() => handleCommentScore(comment.id, -1)} src="images/icon-minus.svg" alt="Minus" />
  </div>
  )
}

export default CommentScorer