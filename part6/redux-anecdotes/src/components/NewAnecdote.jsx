import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
// the useDispatch hook provides any React component access to the dispatch function of the Redux store defined in main.jsx.
// components can access the data stored in the store with the useSelector-hook of the react-redux library.

const NewAnecdote = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value  = ''
    dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default NewAnecdote