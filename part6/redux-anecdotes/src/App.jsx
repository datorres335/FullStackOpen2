import { useSelector, useDispatch } from 'react-redux'
import { createStore } from 'redux'
import reducer from './reducers/anecdoteReducer'

const getId = () => (100000 * Math.random()).toFixed(0)

const createVote = (id) => { // this is a "action creator", aka functions that create actions
    return {
      type: 'VOTE',
      payload: { id }
    }
  }

const createAnecdote = (content) => { // this is a "action creator", aka functions that create actions
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content,
      id: getId(),
      votes: 0
    }
  }
}

const App = () => {
  const store = createStore(reducer)
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  console.log("disregard this log message", dispatch)
  
  const vote = (id) => {
    store.dispatch(createVote(id))
  }

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value  = ''
    store.dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App