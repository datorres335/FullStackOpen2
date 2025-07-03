import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import VoteButton from './components/VoteButton'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './services/requests'
import { NotificationContextProvider } from './components/NotificationContext'

const App = () => {
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false, // this prevents refetching on window focus
    retry: false // this prevents retrying on failure
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <NotificationContextProvider>
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
              <VoteButton anecdote={anecdote} />
            </div>
          </div>
        )}
      </div>
    </NotificationContextProvider>
  )
}

export default App
