import { useQuery } from "@apollo/client"
import { ALL_BOOKS, FILTERED_BOOKS } from "../queries"
import { useState, useEffect } from "react";

const FilterGenreButtons = ({ setFilter, books }) => {
  const uniqueGenres = [...new Set(books.map(book => book.genres).flat())]
  //console.log("Unique Genres:", uniqueGenres);
  
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
  const books = useQuery(ALL_BOOKS)
  //console.log("Books Data:", books);
  const [filter, setFilter] = useState("all genres")
  const [filteredBooks, setFilteredBooks] = useState(books.data ? books.data.allBooks : []);

  useEffect(() => {
    if (books.data) {
      if (filter === "all genres") {
        setFilteredBooks(books.data.allBooks);
      } else {
        setFilteredBooks(books.data.allBooks.filter(book => book.genres.includes(filter)));
      }
    }
  }, [books.data, filter]);

  if (books.loading) return <div>loading...</div>
  if (books.error) return <div>Error: {books.error.message}</div>
  if (!props.show) return null

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
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <FilterGenreButtons setFilter={setFilter} books={books.data.allBooks} />
    </div>
  )
}

export default Books
