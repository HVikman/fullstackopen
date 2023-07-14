import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useQuery, useMutation, useQueryClient, } from 'react-query'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'



const App = () => {

  const queryClient = useQueryClient()
  const { setNotification, clearNotification } = useContext(NotificationContext)

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const handleVote = (anecdote) => {
    console.log('vote', anecdote)
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes+1 })
    setNotification(`Anecdote ${anecdote.content} voted.`)
    setTimeout(() => {
      clearNotification()
    }, 5000)
  }


  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
    onError: () => {
      setNotification('too short anecdote')
      setTimeout(() => {
        clearNotification()
      }, 5000)
    }
  })

  const handleAdd = (anecdote) => {
    newAnecdoteMutation.mutate(anecdote)


  }

  const result = useQuery('anecdotes', getAnecdotes, {
    refetchOnWindowFocus: false, retry: 1
  })

  const anecdotes = result.data
  console.log(result)

  if ( !anecdotes || result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>anecdote service not available due to problems with server</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm handleAdd={handleAdd} />
      {anecdotes.sort((a, b) => b.votes - a.votes) ? anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ): null}

    </div>
  )
}

export default App
