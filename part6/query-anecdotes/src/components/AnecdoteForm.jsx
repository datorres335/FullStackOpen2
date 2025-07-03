import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/requests'
import NotificationContext from './NotificationContext'
import { useContext } from 'react'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { setNotification } = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => { // newAnecdote is the response from createAnecdote
      const anecdotes = queryClient.getQueryData(['anecdotes']) // this updates the application data dispayed on screen, more optimized than invalidateQueries
      queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote])
      setNotification(`New anecdote '${newAnecdote.content}' created`, 5000)
    },
    onError: (error) => {
      setNotification('too short anecdote, must have length 1 or more', 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ 
      content,
      votes: 0
     })
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
