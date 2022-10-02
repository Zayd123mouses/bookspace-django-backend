import { useState, useEffect } from 'react'
import { useMatch} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addBook,
  deleteBookAction,
  updateBookAction,
} from '../reducers/userBooksReducer'
import googleService from '../services/googleApi'
import { Rating } from '@mui/material';
import CommentPop from './Commentpop'
import ListComments from './Comments'
import Form from 'react-bootstrap/Form'
import { useNavigate } from "react-router-dom";


const Book = () => {
  const [book, setBook] = useState([])
  const [starred, setStarred] = useState(false)
  const [review, setReview] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.user)
  const bookInShelve = useSelector(({ userBooks }) =>
    userBooks.find((bookInShelve) => bookInShelve.book_id === book.id)
  )
  //TODO: Save other relevant data to display on individual view of saved books
  //TODO: Save object of different image sizes instead of a string

  // if refresh the page , search google api and get the book
  const match = useMatch('/books/:id')
  useEffect(() => {
    if (match) {
      googleService.getBook(match.params.id).then((book) => setBook(book))

    }
  }, [match]) //this should render only once.

// useEffect(()=>{
//   dispatch(initializeComments(book.id)
//   )
// },[book])

  useEffect(() => {
    if (bookInShelve) {
      setStarred(true)
      setReview(bookInShelve.review)
    }

  }, [bookInShelve])
  
  
  

  const saveBookToMyShelve = (state,review) => {
    if(!user){
      return navigate("/login")
    }
    const bookToSave = {
      user_id: user.user_id,
      book_title: book.volumeInfo.title,
      book_state: state,
      book_id: book.id,
      book_image: book.volumeInfo.imageLinks.thumbnail,
      review: state === 'read' && review ? review : 0

    }

    dispatch(addBook(bookToSave))
  }

  const updateShelf = (state,review) => {
    if(!user){
      return navigate("/login")
    }
    const bookToUpdate = {
      user_id: user.user_id,
      book_title: book.volumeInfo.title,
      book_state: state,
      book_id: book.id,
      book_image: book.volumeInfo.imageLinks.thumbnail,
      review: state === 'read' && review ? review : 0
    }
    dispatch(updateBookAction(book.id, bookToUpdate))
  }

  const removeBookFromMyShelve = () => {
    dispatch(deleteBookAction(book.id))
  }
  
  const handleSelectChange = (event) => {
    if(!user){
      return navigate("/login")
    }
    if (starred && event.target.value === 'none') {
      removeBookFromMyShelve()
      setStarred(false)
      setReview(0)
    } else if (starred) {
      return updateShelf(event.target.value)
    } else {
      return saveBookToMyShelve(event.target.value)
    }
  }

  //TODO: Arrange default select after refresh and for non saved books
  // TODO: Optimize the UX 
  const setSelect = () => {
    if (starred) {
      return (
      
        <Form.Select
          id={book.id}
          value={bookInShelve.book_state}
          onChange={handleSelectChange}
        >
          <option value='none' disabled>
            Move to...
          </option>
          <option value='reading'>Currently Reading</option>
          <option value='toRead'>Want to Read</option>
          <option value='read'>Read</option>
          <option value='none'>None</option>
        </Form.Select>
      )
    } else {
      return (
        <Form.Select id={book.id} onChange={handleSelectChange} value='none'>
          <option value='none' disabled>
            Move to...
          </option>
          <option value='reading'>Currently Reading</option>
          <option value='toRead'>Want to Read</option>
          <option value='read'>Read</option>
          <option value='none'>None</option>
        </Form.Select>
      )
    }
  }


const handleStars = (event)=>{
  if(!user){
    return navigate("/login")
  }
  setReview(Number(event.target.value))
  if(starred){
    updateShelf('read',Number(event.target.value) )
  }else{
    saveBookToMyShelve('read',Number(event.target.value))
  }
}

  if (book.length < 1) {
    return <h1>Loading....</h1>
  }

  return (
    <section className='hero-section'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-7 pt-5 mb-5 align-self-center'>
            <div className='promo pe-md-3 pe-lg-5'>
              <h1 className='headline mb-3'>
                {book.volumeInfo.title} <br />
              </h1>
              <hr />
              <br />
              <div className='subheadline mb-4'>
                <div>
                  Authors:{' '}
                  {book.volumeInfo.authors && book.volumeInfo.authors.map((author) => {
                    return <span key={author}>{author}, </span>
                  })}
                </div>
                <br />
                <div>Publisher: {book.volumeInfo.publisher.slice(1, -1)}</div>
                <br />
                <div>Published Date: {book.volumeInfo.publishedDate}</div>
                <br />
                <div>Number of Pages: {book.volumeInfo.pageCount}</div>
                {!user ? null : (
                  <div className='rating'>
                    <input
                      name='rating'
                    />
                    <label htmlFor='5'>☆</label>
                  </div>
                )}
                <Rating name="size-large" value={review} onChange={handleStars}  size="large" />

                {setSelect()}
             

                <div>
                  
                <CommentPop review_value={review}
                 setReviewParent={setReview} 
                 starred={starred}
                  updateShelf={updateShelf}
                   saveBookToMyShelve={saveBookToMyShelve} 
                   book_id={book.id}
                   bookInShelve={bookInShelve}
                   />



                </div>
              </div>
              <hr />
              <h1>Description </h1>
              <br />
              <div className='subheadline mb-4'>
                {/* <h6>`${book.volumeInfo.description}`</h6> */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: book.volumeInfo.description
                      ? book.volumeInfo.description
                      : 'No description available',
                  }}
                />
              </div>
              {!user ? null : (
                <div className='cta-holder row gx-md-3 gy-3 gy-md-0'>
                  <div className='col-12 col-md-auto'>
                    <a
                      className='btn btn-primary w-100'
                      href={book.volumeInfo.previewLink}
                    >
                      Read a sample
                    </a>
                  </div>
                  <div className='col-12 col-md-auto'>
                    <a
                      className='btn btn-secondary scrollto w-100'
                      href={book.volumeInfo.infoLink}
                    >
                      Check on GooglePLay
                    </a>
                  </div>
                </div>
              )}
              <div className='hero-quotes mt-5'>
                <div
                  id='quotes-carousel'
                  className='quotes-carousel carousel slide carousel-fade mb-5'
                  data-bs-ride='carousel'
                  data-bs-interval='8000'
                ></div>
              </div>
            </div>
          </div>

          <div className='col-50 col-md-5 mb-8 '>
            <br />
            <br />
            <div className='book-cover-holder'>
              <img
                style={{ width: '70%' }}
                src={
                  book.volumeInfo.imageLinks 
                  ? book.volumeInfo.imageLinks.large ? book.volumeInfo.imageLinks.large
                    
                    : book.volumeInfo.imageLinks.thumbnail
                    : ''
                }
                alt='book cover'
              />
            </div>
            <br/>
            <br/>
            <hr/>
            <ListComments  book_id={book.id} />
          </div>
          
        </div>
      </div>
{/* //////////////////////// */}

    </section>
  )
}

export default Book
