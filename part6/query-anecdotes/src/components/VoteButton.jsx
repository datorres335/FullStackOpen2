import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnecdote } from '../services/requests'
import NotificationContext from './NotificationContext'
import { useContext } from 'react'

const VoteButton = ({ anecdote }) => {
  const queryClient = useQueryClient()
  const { setNotification } = useContext(NotificationContext)

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (votedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote => anecdote.id === votedAnecdote.id ? votedAnecdote : anecdote))
      setNotification(`Anecdote '${votedAnecdote.content}' voted`, 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <button onClick={() => handleVote(anecdote)}>vote</button>
  )
}

export default VoteButton