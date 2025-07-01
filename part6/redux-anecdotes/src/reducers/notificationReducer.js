import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', anecdoteId: null },
  reducers: {
    setNotification(state, action) {
      state.message = action.payload.message
      state.anecdoteId = action.payload.anecdoteId
    },
    clearNotification(state) {
      state.message = ''
      state.anecdoteId = null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer