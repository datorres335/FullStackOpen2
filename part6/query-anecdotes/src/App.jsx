import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './services/requests'

const App = () => {
  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      //queryClient.invalidateQueries({ queryKey: ['anecdotes'] }) // this updates the application data dispayed on screen
      const anecdotes = queryClient.getQueryData(['anecdotes']) // this updates the application data dispayed on screen, more optimized than invalidateQueries
      const updatedAnecdotes = anecdotes.map(anecdote => 
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      )
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false, // this prevents refetching on window focus
    retry: false // this prevents retrying on failure
  })
  console.log('Anecdotes from db: ', JSON.parse(JSON.stringify(result)))
  
  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.error) {
    console.error('Error fetching anecdotes:', result.error);
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
