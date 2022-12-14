import { useState, useEffect } from 'react'
import Books from './components/Books'
import SearchForm from './components/SearchForm'
import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './components/HomePage'
import Book from './components/Book'
import { useDispatch, useSelector } from 'react-redux'
import userService from './services/user'
import { loginUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import Register from './components/Register'
import UserShelve from './components/UserShelve.js'
import Notification from './components/Notification'
import About from './components/About'
import { initializeUserBooks } from './reducers/userBooksReducer'
import { setNotification } from './reducers/notificationReducer'

import googleService from './services/googleApi'
import ResponsiveAppBar from './components/ResponsiveNavbar'
import SingleShelve from './components/SingleShelve'
// TODO: navigate to home page on logout

function App() {
  const [searchResult, setSearchResult] = useState({
    items: [],
    totalItems: null,
  })
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // make sure to not run this hook unless there is a user , or the server will not reponse and the frontend will get error
  useEffect(() => {
    if (user) {
      dispatch(initializeUserBooks())
    }
  }, [user, dispatch])

  useEffect(() => {
    const booksData = JSON.parse(window.localStorage.getItem('lastSearch'))
    if (typeof booksData === 'undefined') {
      setSearchResult({ items: [], totalItems: null })
    } else if (booksData) {
      setSearchResult(booksData.books)
    }
  }, [])

  //   google API to get the books
  const handleSearch = (query) => {
    // clearing the searchResult each time a research is made to give some nice styling and not make the site just static
    window.localStorage.removeItem('lastSearch')
    setSearchResult({ items: [], totalItems: null })
    googleService
      .searchBooks(query)
      .then((searchResult) => {
        if (!searchResult || searchResult.totalItems === 0) {
          dispatch(
            setNotification('No results, try a different search term', 'error')
          )
        }
        setSearchResult(searchResult)
      })
      .catch((error) => console.log(error))
  }

  // get the user token if the user was logged in
  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      dispatch(loginUser(userFromStorage))
    }
  }, [dispatch])

  // logout and destroy token

  // to prevent crashes

  const resetStorage = () => {
    window.localStorage.removeItem('lastSearch')
    setSearchResult({ items: [], totalItems: null })
  }

  return (
    <>
      <ResponsiveAppBar setSearchResult={setSearchResult} />

      <div className='container'>
        <Notification />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route exact path='/books/:id' element={<Book />} />
          <Route
            exact
            path='/search'
            element={
              <>
                <SearchForm
                  handleSearch={handleSearch}
                  resetStorage={resetStorage}
                />
                <Books searchResult={searchResult} />
              </>
            }
          />
          {/* for now this path is only accessed if the user is not authinticated , after adding new routes and feature we will create a private router */}
          <Route
            path='/register'
            element={!user ? <Register /> : <Navigate replace to='/login' />}
          />

          <Route path='/login' element={<LoginForm />} />
          <Route path='/my-shelve' element={<UserShelve />} />
          <Route
            path='/my-shelve/read-books'
            element={<SingleShelve title={'Books Read'} />}
          />
          <Route
            path='/my-shelve/reading-books'
            element={<SingleShelve title={'Currently Reading'} />}
          />
          <Route
            path='/my-shelve/want-to-read-books'
            element={<SingleShelve title={'Want to Read'} />}
          />
          <Route path='/about' element={<About />} />
        </Routes>
      </div>
    </>
  )
}

export default App
