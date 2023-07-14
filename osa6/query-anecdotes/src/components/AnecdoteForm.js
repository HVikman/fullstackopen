import { useContext } from 'react'
import NotificationContext from '../NotificationContext'



const AnecdoteForm = ({ handleAdd }) => {
  const { setNotification, clearNotification } = useContext(NotificationContext)


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log(content)
    handleAdd({ content: content, votes: 0, id: getId() })
    setNotification(`Anecdote ${content} created.`)
    setTimeout(() => {
      clearNotification()
    }, 5000)

  }

  const getId = () => (100000 * Math.random()).toFixed(0)

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
