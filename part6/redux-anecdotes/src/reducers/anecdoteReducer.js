import { createSlice } from '@reduxjs/toolkit'
//current is used to print the current state of the store in a human-readble format. Otherwise you'll get an output that is not very readable, because the state is a Proxy object.                                           

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

// export const createVote = (id) => { // this is a "action creator", aka functions that create actions
//     return {
//       type: 'VOTE',
//       payload: { id }
//     }
//   }

// export const createAnecdote = (content) => { // this is a "action creator", aka functions that create actions
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }

// const anecdoteReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'VOTE':{
//       const id = action.payload.id
//       const anecdoteToVote = state.find(a => a.id === id)
//       const votedAnecdote = {
//         ...anecdoteToVote,
//         votes: anecdoteToVote.votes + 1
//       }
      
      // return state.map(anecdote =>
      //   anecdote.id !== id ? anecdote : votedAnecdote
      // )
//     }
//     case 'NEW_ANECDOTE':
//       return [...state, action.payload]

//     default:
//       return state
//   }
// }

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const anecdote = action.payload
      state.push(asObject(anecdote))
    },
    createVote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(n => n.id === id)
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      //console.log('current state:', current(state))
      
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      )
    }
  }
})

export const { createAnecdote, createVote } = anecdoteSlice.actions
export default anecdoteSlice.reducer