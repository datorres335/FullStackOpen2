import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
// the useDispatch hook provides any React component access to the dispatch function of the Redux store defined in main.jsx.
// components can access the data stored in the store with the useSelector-hook of the react-redux library.
import { clearCreateNotification, setCreateNotification } from '../reducers/notificationReducer'
import Notification from './Notification'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value  = ''

    const newAnecdote = await anecdoteService.createNew(content) 

    dispatch(createAnecdote(newAnecdote))
    dispatch(setCreateNotification({ message: 'New Anecdote created: ' + content, anecdoteId: null }))
    setTimeout(() => {
      dispatch(clearCreateNotification())
    }, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <Notification color="green" type="create"/>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm