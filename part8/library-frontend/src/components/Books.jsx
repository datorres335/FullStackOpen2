import { useQuery, useSubscription } from "@apollo/client"
import { ALL_BOOKS, BOOK_ADDED } from "../queries"
import { useState } from "react";

const FilterGenreButtons = ({ setFilter, books }) => {
  const uniqueGenres = [...new Set(books.map(book => book.genres).flat())]
  
  return (
    <div>
      {uniqueGenres.map((genre, index) => (
        <button key={index} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter("all genres")}>
        all genres
      </button>
    </div>
  )
}

const Books = (props) => {
  const [filter, setFilter] = useState("all genres")
  const allBooksQuery = useQuery(ALL_BOOKS, {
    variables: filter === "all genres" ? {} : { genre: filter },
  })

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      
      client.cache.updateQuery(
        { 
          query: ALL_BOOKS,
          variables: filter === "all genres" ? {} : { genre: filter }
        }, 
        (data) => {
          if (!data) return data
          
          const bookExists = data.allBooks.some(book => book.id === addedBook.id)
          if (bookExists) return data
          
          if (filter === "all genres" || addedBook.genres.includes(filter)) {
            return {
              allBooks: [...data.allBooks, addedBook]
            }
          }
          
          return data
        }
      )
    }
  })

  if (allBooksQuery.loading) return <div>loading...</div>
  if (allBooksQuery.error) return <div>Error: {allBooksQuery.error.message}</div>

  if (!props.show) return null

  const allBooks = allBooksQuery.data?.allBooks || []

  return (
    <div>
      <h2>books</h2>

      <p>in genre: <strong>{filter}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <FilterGenreButtons setFilter={setFilter} books={allBooks} />
    </div>
  )
}

export default Books
