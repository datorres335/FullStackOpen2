import { createSlice } from "@reduxjs/toolkit"
import userService from "../services/users"

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const {setUser} = userSlice.actions;

export const loggedInUser = user => {
  return async dispatch => {
    dispatch(setUser(user))
  }
}

export default userSlice.reducer;