import { useState } from 'react'
import { gql, useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommended from './components/Recommended'

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
    }
  }
`


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage(null)
  }

  useSubscription(BOOK_ADDED, {
    onData: ( { data } ) => {
      console.log(data)
      window.alert(`Book ${data.data.bookAdded.title} added`)
    }
  })

  if (!token && !localStorage.getItem('library-token')){
    return(
      <div>
        <Login setToken={setToken} />
      </div>
    )
  }



  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => logout()}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommended'} />
    </div>
  )
}

export default App
