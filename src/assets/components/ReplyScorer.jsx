import React, { useContext } from 'react'
import { CommentContext } from '../context/CommentContext';

const ReplyScorer = ({comment, reply}) => {

const {setComments, comments} = useContext(CommentContext)

    const handleReplyScore = (commentId, replyId, increment) => {
        const updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            const reply = comment.replies.find(reply => reply.id === replyId);
            if (reply) {
              reply.score += increment;
            }
          }
          return comment;
        });
        setComments(updatedComments);
      };

    return (
        <div className='scorer'>
            <img onClick={() => handleReplyScore(comment.id, reply.id, 1)} src="images/icon-plus.svg" alt="Plus" />
            <p className='score'> {reply.score} </p>
            <img onClick={() => handleReplyScore(comment.id, reply.id, -1)} src="images/icon-minus.svg" alt="Minus" />
        </div>
    )
}

export default ReplyScorer