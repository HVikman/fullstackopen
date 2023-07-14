import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const addNew = async (anecdote) => {
  const res = await axios.post(baseUrl, anecdote)
  return res.data
}

const editAnecdote = async (anecdote) => {
  const res = await axios.put(`${baseUrl}/${anecdote.id}`, { content: anecdote.content, id: anecdote.id, votes: anecdote.votes+1 })
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, addNew, editAnecdote }