import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    create: { message: '', color: ''},
  },
  reducers: {
    setCreateNotification(state, action) {
      state.create.message = action.payload.message;
      state.create.color = action.payload.color;
    }
  }
})

export const { setCreateNotification } = notificationSlice.actions;

export const createNotification = (message, color) => {
  return async (dispatch) => {
    dispatch(setCreateNotification({ message, color }));

    setTimeout(() => {
      dispatch(setCreateNotification({ message: '', color: '' }));
    }, 5000);
  }
}

export default notificationSlice.reducer;