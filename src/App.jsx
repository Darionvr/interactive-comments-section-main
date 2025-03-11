import React, { useContext, useState } from 'react'
import './App.css'
import data from './data.json'
import CommentScorer from './assets/components/CommentScorer';
import { CommentContext } from './assets/context/CommentContext';
import CommentInfo from './assets/components/CommentInfo';
import { ModalContext } from './assets/context/ModalContext';
import Modal from './assets/components/Modal';
import MyUserIcons from './assets/components/MyUserIcons'
import ReplyButton from './assets/components/ReplyButton';
import Form from './assets/components/Form';
import ReplyScorer from './assets/components/ReplyScorer';




function App() {

  const { comments, setComments, myUser } = useContext(CommentContext)
  const { deleteCModal, deleteRModal, setDeleteCModal, setDeleteRModal } = useContext(ModalContext)

  const [inputComment, setInputComment] = useState('')
  const [replyState, setReplyState] = useState({ isReplying: false, commentId: null, replyId: null });
  const [commentToEdit, setCommentToEdit] = useState('')
  const [editingState, setEditingState] = useState({isEditing:false, cId:null, rId: null})




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

  const editButton = (commentId) => {
    const selectedComment = comments.find(comment => comment.id === commentId)
    setCommentToEdit(selectedComment.content)
    setEditingState({isEditing:true, cId: commentId, rId: null})

  }
  const handleEditform = (e) => {
    if(editingState.cId != null){
      e.preventDefault()
      setComments(prevcomments => 
        prevcomments.map(comment =>
          comment.id === editingState.cId ? {...comment, content: commentToEdit} : comment
        )
      )
      setCommentToEdit('')
      setEditingState({isEditing:false, cId:null, rId: null})
    }

  }

  return (
    <main>
      {comments.map(comment => (
        <React.Fragment key={comment.id}>
          <div className='comment-container'>
            <CommentScorer
              comment={comment}
            />
            <div className="content">
              <CommentInfo
                comment={comment}
              />
              <p className='comment'>{comment.content}</p>
              {deleteCModal.isOpen && deleteCModal.commentId === comment.id && (
                <Modal
                  clickYes={() => deleteComments(comment.id)}
                  clickNo={() => setDeleteCModal({ isOpen: false, commentId: null })}
                  text={'comment'} />
              )}
            </div>
            {comment.user.username === myUser.username ? (
              <MyUserIcons
                deleteClick={() => handleDeleteCModal(comment.id)}
                editClick={() => editButton(comment.id)}
              />
            ) : (
              <ReplyButton
                click={() => replyButton(comment.id, null)}
              />
            )}
          </div>
          {replyState.isReplying && replyState.commentId === comment.id && replyState.replyId === null && (
            <Form
              submit={handleReply}
              change={(e) => setInputComment(e.target.value)}
              text={'Reply'}
              value={inputComment} />
          )}
          {editingState.isEditing && editingState.cId === comment.id && editingState.rId === null && (
            <Form
            text={'UPDATE'}
            value={commentToEdit}
            change={(e) => setCommentToEdit(e.target.value)}
            submit={handleEditform}

            />
          )}
          <div className="thread" key={comment.id}>
            {comment.replies && comment.replies.map(reply => (
              <React.Fragment key={reply.id}>
                <div className="comment-container" >
                  <ReplyScorer
                    comment={comment}
                    reply={reply} />
                  <div className="content">
                    <div className="comment-info">
                      <img className='user-avatar' src={reply.user.image.png} alt="user avatar" />
                      <p className='user-name'>{reply.user.username}</p>
                      {reply.user.username === myUser.username ? <p className='you'> You </p> : ''}
                      <p>{reply.createdAt}</p>
                      {reply.user.username === myUser.username ? (
                        <MyUserIcons
                          click={() => handleDeleteRModal(comment.id, reply.id)} />
                      ) : (
                        <ReplyButton
                          deleteClick={() => replyButton(comment.id, reply.id)} />
                      )}
                    </div>
                    <p className='reply-comment'><span className='reply-to'> @{reply.replyingTo}</span>{reply.content}</p>

                    {deleteRModal.isOpen && deleteRModal.commentId === comment.id && deleteRModal.replyId === reply.id && (
                      <Modal
                        clickYes={() => deleteReplies(comment.id, reply.id)}
                        clickNo={() => setDeleteRModal(false)}
                        text={'reply'} />
                    )}
                  </div>
                </div>
                {replyState.isReplying && replyState.commentId === comment.id && replyState.replyId === reply.id && (
                  <Form
                    submit={handleReply}
                    change={(e) => setInputComment(e.target.value)}
                    text={'REPLY'}
                    value={inputComment} />
                )}
              </ React.Fragment>
            ))
            }
          </div>
        </React.Fragment>
      ))}
      <Form
        submit={handleComments}
        change={(e) => setInputComment(e.target.value)}
        text={'SEND'}
        value={inputComment}
      />
    </main>
  );
}

export default App