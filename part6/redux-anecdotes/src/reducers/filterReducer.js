import { createSlice } from '@reduxjs/toolkit'

// export const filterChange = (filter) => {
//   return {
//     type: 'SET_FILTER',
//     payload: filter
//   }
// }

// const filterReducer = (state = '', action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.payload
//     default:
//       return state
//   }
// }

// export default filterReducer

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      console.log('filterSlice state:', state)
      
      return action.payload
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer