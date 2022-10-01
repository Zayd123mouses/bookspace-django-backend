import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Rating } from '@mui/material';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useField } from '../hooks/fields'
import { useDispatch, useSelector } from 'react-redux'
import {updateUserComment, addUserComment} from '../reducers/commentsReducer'
import {initializeUserComment, removeUserComment} from '../reducers/commentsReducer'


const CommentPop = ({review_value, setReviewParent,starred, updateShelf,saveBookToMyShelve ,book_id, bookInShelve})=> {
  const [show, setShow] = useState(false);
  const [review, setReview]= useState(review_value)
  const [userComment, setUserComment] = useState({})

  const dispatch = useDispatch()
  const comments = useSelector(state=>state.comments.userComment)

   console.log(comments,"////////////////")
   
useEffect(()=>{
  if(bookInShelve){
    dispatch(initializeUserComment(book_id))
  }else{
 dispatch(removeUserComment())
  }
},[book_id, dispatch,starred])

// for editing feature if usercomment is found
useEffect(()=>{
  if(comments){
    setUserComment(comments)
  }
},[comments,dispatch])


useEffect(()=>{
  setReview(review_value)
},[review_value])




  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const commentField = useField("text")
 

  const handleSubmit = (event)=>{
    event.preventDefault()

    const commentToAdd = {comment: commentField.value !== '' ?commentField.value : userComment.comment}
    if(!comments){
      dispatch(addUserComment(book_id,commentToAdd))
    }else{
      dispatch(updateUserComment(book_id,commentToAdd))
    }
      commentField.onSubmit()
      setShow(false)
      if(Number(bookInShelve.review) !== Number(review) ||Number(review) === 0){
      if(starred){
        updateShelf('read', Number(review))
      }else{
        saveBookToMyShelve('read', Number(review))
      }
    }
  }
if(!comments){

  return (
      <>
      {bookInShelve && 
      <>
      <Button variant="primary" onClick={handleShow}>
      Write a review
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>

        <Modal.Body>
        <h3>Add a Review</h3>
        <Rating value={review_value}   size="small" onChange={({target})=>setReviewParent((Number(target.value)))}/>
        <FloatingLabel controlId="floatingTextarea2" label="Comments">
        <Form.Control
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: '100px' }}
          {...commentField}
        />
      </FloatingLabel>
      
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"  onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type='submit' >
            Save Changes
          </Button>
    
        </Modal.Footer>
 </Form>
      </Modal>
      </> }
    </>
  )
  } else{
    return(
      <div>
        <hr/>
       <h3>Your review</h3>
       <p>{userComment?.comment}</p>
       <Button variant="primary" onClick={handleShow}>
      Edit review
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>

        <Modal.Body>
        <h3>Add a Review</h3>

        <Rating value={review_value}   size="small" onChange={({target})=>setReviewParent((Number(target.value)))}/>
        <FloatingLabel controlId="floatingTextarea3" label="CommentsEdit">
        <Form.Control
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: '100px' }}
          value={userComment?.comment} 
          onChange={(e) => {setUserComment( {...userComment, comment: e.target.value})}}
        />
      </FloatingLabel>
      
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"  onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type='submit' >
            Save Changes
          </Button>
    
        </Modal.Footer>
 </Form>
      </Modal>
      </div>
    )
  }

}

export default CommentPop