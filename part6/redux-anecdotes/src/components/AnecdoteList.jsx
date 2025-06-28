import { useDispatch, useSelector } from 'react-redux'
import { createVote } from '../reducers/anecdoteReducer'
// the useDispatch hook provides any React component access to the dispatch function of the Redux store defined in main.jsx.
// components can access the data stored in the store with the useSelector-hook of the react-redux library.

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes) // useSelector receives a function as a parameter. The function either searches for or selects data from the Redux store
  const filter = useSelector(state => state.filter)
  const filteredSortedAnecdotes = anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => b.votes - a.votes)

  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(createVote(id))
  }

  return (
    <div>
      {filteredSortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <Anecdote anecdote={anecdote} handleClick={() => vote(anecdote.id)} />
        </div>
      )}
    </div>
  )
}

export default AnecdoteList