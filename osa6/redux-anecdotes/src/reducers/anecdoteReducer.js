import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const initialState = []
const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: initialState.map((content) => ({
    content,
    id: 0,
    votes: 0
  })),
  reducers: {

    vote: (state, action) => {
      const anecdote = state.find((anecdote) => anecdote.id === action.payload)
      if (anecdote) {
        anecdote.votes++
        state.sort((a, b) => b.votes - a.votes)
      }
    },
    setAnecdotes(state, action) {
      action.payload.sort((a, b) => b.votes - a.votes)
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.votes - a.votes)
    },
  }
})

export const { vote, setAnecdotes , appendAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = {
      content: content,
      id: getId(),
      votes: 0
    }
    const res = await anecdoteService.addNew(newAnecdote)
    dispatch(appendAnecdote(res))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.editAnecdote(anecdote)
    dispatch(vote(updatedAnecdote.id))
  }
}

export default anecdoteSlice.reducer
