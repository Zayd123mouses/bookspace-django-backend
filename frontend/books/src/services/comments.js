import axios from 'axios'
import logService from './login'

const baseUrl = 'http://127.0.0.1:8000/books-api/v1-comments/'

const getComments = async (book_id) => {
  const response = await axios.get(`${baseUrl}${book_id}`)
  return response.data
}

const addComment = async (book_id, comment) => {
  const response = await axios.post(
    `${baseUrl}${book_id}`,
    comment,
    logService.config()
  )
  return response.data
}

const getUserComment = async (book_id) => {
  const response = await axios.get(
    `${baseUrl}comment/${book_id}`,
    logService.config()
  )
  return response.data
}

<<<<<<< HEAD
const addReply= async (book_id, comment)=>{
    const response = await axios.post(`${baseUrl}reply/${book_id}`,comment, logService.config() )
    console.log(response.data)
    return response.data
=======
const addReply = async (book_id, comment) => {
  const response = await axios.post(
    `${baseUrl}reply/${book_id}`,
    comment,
    logService.config()
  )
  return response.data
>>>>>>> d035485d6e89fb7d38b3ced2d0c9189ffdc547a3
}
export default { getComments, addComment, getUserComment, addReply }
