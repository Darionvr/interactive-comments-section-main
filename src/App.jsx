import React, { useState } from 'react'
import './App.css'
import data from './data.json'




function App() {

  const [comments, setComments] = useState(data.comments);
  const myUser = data.currentUser;
  const [inputComment, setInputComment] = useState('')
  const [replyState, setReplyState] = useState({ isReplying: false, commentId: null, replyId: null });
  const [deleteCModal, setDeleteCModal] = useState({ isOpen: false, commentId: null });
  const [deleteRModal, setDeleteRModal] = useState({ isOpen: false, commentId: null, replyId: null });


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

  const findLastId = (comments) => {
    let maxId = 0;

    comments.forEach(comment => {
      if (comment.id > maxId) {
        maxId = comment.id;
      }

      comment.replies.forEach(reply => {
        if (reply.id > maxId) {
          maxId = reply.id;
        }
      });
    });

    return maxId;
  };

  const handleComments = (e) => {
    e.preventDefault()
    const newId = findLastId(comments) + 1;
    const newComment = {
      id: newId,
      content: inputComment,
      createdAt: "just now",
      score: 0,
      user: myUser,
      replies: []
    };
    setComments([...comments, newComment]);
    setInputComment('')


  }

  const handleReply = (e) => {
    e.preventDefault();
    const newId = findLastId(comments) + 1;
    const updateReplies = comments.map(comment => {
      if (comment.id == replyState.commentId) {
        const newReply = {
          id: newId,
          content: inputComment,
          createdAt: "just now",
          score: 0,
          replyingTo: comment.user.username,
          user: myUser,
        }
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        }
      }
      return comment;
    })
    setComments(updateReplies)
    setInputComment('')
    setReplyState({ isReplying: false, commentId: null });


  }

  const deleteComments = (commentId) => {

    const deletedCo = comments.filter(comment => comment.id !== commentId)
    setComments(deletedCo)
    setDeleteCModal(false)
  }

  const deleteReplies = (commentId, replyId) => {

    const updateReplies = comments.map(comment => {
      if (comment.id == commentId) {
        const filteredReply = comment.replies.filter(reply => reply.id !== replyId)
        return {
          ...comment,
          replies: filteredReply
        }
      }
      return comment
    })
    setComments(updateReplies)
    setDeleteRModal({ isOpen: false, commentId: null, replyId: null });
  }

  const replyButton = (Cid, Rid) => {

    setReplyState({ isReplying: true, commentId: Cid, replyId: Rid })

  }

  const handleDeleteCModal = (commentId) => {
    setDeleteCModal({ isOpen: true, commentId });
  };

  const handleDeleteRModal = (commentId, replyId) => {
    setDeleteRModal({ isOpen: true, commentId, replyId });
  };


  return (
    <main>
      {comments.map(comment => (
        <React.Fragment key={comment.id}>
          <div className='comment-container'>
           
            <div className='scorer'>
              <img onClick={() => handleCommentScore(comment.id, 1)} src="images/icon-plus.svg" alt="Plus" />
              
              <p className='score'> {comment.score} </p>
              <img onClick={() => handleCommentScore(comment.id, -1)} src="images/icon-minus.svg" alt="Minus" />
            </div>
            <div className="content">
              <div className="comment-info">
                <img className='user-avatar' src={comment.user.image.png} alt="user avatar" />
                <p className='user-name'>{comment.user.username}</p>
                {comment.user.username === myUser.username ? <p className='you'> You </p> : ''}
                <p>{comment.createdAt}</p>

              </div>

              <p className='comment'>{comment.content}</p>
              {deleteCModal.isOpen && deleteCModal.commentId === comment.id && (
                <div className="modal">
                  <div className="delete-card">
                    <p>Delete comment</p>
                    <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                    <div className="delete-buttons">
                      <button onClick={() => setDeleteCModal({ isOpen: false, commentId: null })} className='no-cancel'>NO, CANCEL</button>
                      <button onClick={() => deleteComments(comment.id)} className='yes-delete'>YES, DELETE</button>
                    </div>
                  </div>
                </div>)}

            </div>
            {comment.user.username === myUser.username ? (

              <div className='my-user-icons'>
                <p className='delete' onClick={() => handleDeleteCModal(comment.id)}><img src="images/icon-delete.svg" alt="Delete icon" /> Delete</p>
                <p className='edit'><img src="images/icon-edit.svg" alt="Edit icon" /> Edit</p>
              </div>

            ) : (
              <button className='reply' onClick={() => replyButton(comment.id, null)}>

                <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" /></svg>
                Reply</button>
            )}

          </div>
          {replyState.isReplying && replyState.commentId === comment.id && replyState.replyId === null && (
            <form className="add-comment" onSubmit={handleReply}>
              <img className='your-avatar' src={data.currentUser.image.png} alt="Your Avatar" />
              <textarea
                placeholder='Add a comment ....'
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
              />
              <button className='send'  >  REPLY </button>
            </form>
          )}
          <div className="thread" key={comment.id}>
            {comment.replies && comment.replies.map(reply => (
              <React.Fragment key={reply.id}>
                <div className="comment-container" >
                  <div className='scorer'>
                    <img onClick={() => handleReplyScore(comment.id, reply.id, 1)} src="images/icon-plus.svg" alt="Plus" />
                    <p className='score'> {reply.score} </p>
                    <img onClick={() => handleReplyScore(comment.id, reply.id, -1)} src="images/icon-minus.svg" alt="Minus" />
                  </div>
                  <div className="content">
                    <div className="comment-info">
                      <img className='user-avatar' src={reply.user.image.png} alt="user avatar" />
                      <p className='user-name'>{reply.user.username}</p>
                      {reply.user.username === myUser.username ? <p className='you'> You </p> : ''}
                      <p>{reply.createdAt}</p>
                      {reply.user.username === myUser.username ? (

                        <div className='my-user-icons'>
                          <p className='delete' onClick={() => handleDeleteRModal(comment.id, reply.id)}>
                            <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" /></svg>
                            Delete</p>
                          <p className='edit'>
                            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" /></svg>
                            Edit</p>
                        </div>

                      ) : (
                        <button className='reply' onClick={() => replyButton(comment.id, reply.id)}>

                          <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" /></svg>
                          Reply</button>
                      )}
                    </div>
                    <p className='reply-comment'><span className='reply-to'> @{reply.replyingTo}</span>{reply.content}</p>
                    {deleteRModal.isOpen && deleteRModal.commentId === comment.id && deleteRModal.replyId === reply.id && (
                      <div className="modal">
                        <div className="delete-card">
                          <p>Delete reply</p>
                          <p>Are you sure you want to delete this reply? This will remove the reply and can't be undone.</p>
                          <div className="delete-buttons">
                            <button onClick={() => setDeleteRModal(false)} className='no-cancel'>NO, CANCEL</button>
                            <button onClick={() => deleteReplies(comment.id, reply.id)} className='yes-delete'>YES, DELETE</button>
                          </div>
                        </div>
                      </div>)}

                  </div>
                </div>
                {replyState.isReplying && replyState.commentId === comment.id && replyState.replyId === reply.id && (
                  <form className="add-comment" onSubmit={handleReply}>
                    <img className='your-avatar' src={data.currentUser.image.png} alt="Your Avatar" />
                    <textarea
                      placeholder='Add a comment ....'
                      value={inputComment}
                      onChange={(e) => setInputComment(e.target.value)}
                    />
                    <button className='send'  >  REPLY </button>
                  </form>
                )}
              </ React.Fragment>
            ))

            }
          </div>
        </React.Fragment>
      ))}
      <form className="add-comment" onSubmit={handleComments}>
        <img className='your-avatar' src={data.currentUser.image.png} alt="Your Avatar" />
        <textarea
          placeholder='Add a comment...'
          value={inputComment}
          onChange={(e) => setInputComment(e.target.value)}
        />
        <button className='send'  > SEND</button>
      </form>

    </main>
  );
}

export default App