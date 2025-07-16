import { useState } from 'react'
import { useMutation } from "@apollo/client"
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook, { loading }] = useMutation(ADD_BOOK, {
    // refetchQueries: [
    //   { query: ALL_BOOKS },
    //   { query: ALL_AUTHORS }
    // ],
    onError: error => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      props.notify(messages)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook)
        }
      })

      // cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
      //   return {
      //     allAuthors: allAuthors.concat(response.data.addAuthor.author)
      //   }
      // })
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const addedBook = response.data.addBook
        const bookAuthor = addedBook.author
        
        // Check if author already exists
        const existingAuthor = allAuthors.find(author => author.name === bookAuthor.name)

        if (existingAuthor) {
          // Author exists, update bookCount
          return {
            allAuthors: allAuthors.map(author =>
              author.name === bookAuthor.name
                ? { ...author, bookCount: author.bookCount + 1 }
                : author
            )
          }
        } else {
          // New author, ADD to list with bookCount = 1
          return {
            allAuthors: allAuthors.concat({  // ✅ Use concat to ADD new author
              ...bookAuthor,
              bookCount: 1
            })
          }
        }
      })
    }
  });

  if (loading) return <div>loading...</div>
  //if (error) return <div>Error: {error.message}</div>
  if (!props.show) return null

  const submit = async (event) => {
    event.preventDefault()

    await addBook({
      variables: {
        title,
        published: parseInt(published),
        author,
        genres
      }
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook