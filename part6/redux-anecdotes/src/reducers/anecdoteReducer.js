import { createSlice } from '@reduxjs/toolkit'
//current is used to print the current state of the store in a human-readble format. Otherwise you'll get an output that is not very readable, because the state is a Proxy object.                                           
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // createAnecdote(state, action) {
    //   state.push(action.payload)
    // },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(anecdote =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      )
    }
  }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const createVote = (id) => {
  return async dispatch => {
    const anecdoteToVote = await anecdoteService.getAnecdote(id)
    const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
    const savedAnecdote = await anecdoteService.updateAnecdote(id, updatedAnecdote)

    dispatch(updateAnecdote(savedAnecdote))
  }
}

export default anecdoteSlice.reducer