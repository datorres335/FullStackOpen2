import { createAnecdote } from '../services/requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => { // newAnecdote is the response from createAnecdote
      const anecdotes = queryClient.getQueryData(['anecdotes']) // this updates the application data dispayed on screen, more optimized than invalidateQueries
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
   })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    //const generatedId = (100000 * Math.random()).toFixed(0)
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
