import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    vote: { message: '', anecdoteId: null },
    create: { message: '', anecdoteId: null }
  },
  reducers: {
    setVoteNotification(state, action) {
      state.vote.message = action.payload.message
      state.vote.anecdoteId = action.payload.anecdoteId
    },
    setCreateNotification(state, action) {
      state.create.message = action.payload.message
      state.create.anecdoteId = action.payload.anecdoteId
    },
    clearVoteNotification(state) {
      state.vote.message = ''
      state.vote.anecdoteId = null
    },
    clearCreateNotification(state) {
      state.create.message = ''
      state.create.anecdoteId = null
    }
  }
})

export const { 
  setVoteNotification, 
  setCreateNotification,
  clearVoteNotification, 
  clearCreateNotification 
} = notificationSlice.actions

export const createNotification = (message, durationInSeconds) => {
  return async (dispatch) => {
    dispatch(setCreateNotification({ message, anecdoteId: null }))

    setTimeout(() => {
      dispatch(clearCreateNotification())
    }, durationInSeconds * 1000)
  }
}

export const voteNotification = (message, anecdoteId, durationInSeconds) => {
  return async (dispatch) => {
    dispatch(setVoteNotification({ message, anecdoteId }))

    setTimeout(() => {
      dispatch(clearVoteNotification())
    }, durationInSeconds * 1000)
  }
}

export default notificationSlice.reducer