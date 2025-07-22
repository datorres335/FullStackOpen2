import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";
import Recommendations from "./components/Recommendations";
import { jwtDecode } from "jwt-decode";
import { useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

// function that takes care of munipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqById = a => {
    let seen = new Set()
    return a.filter(item => {
      let k = item.id
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqById(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client })=> {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)

      try {
        const decodedToken = jwtDecode(savedToken)
        // console.log("Decoded Token:", decodedToken);
        // console.log("user's favorite genre from App comp.:", decodedToken.favoriteGenre);
        
        setUser({
          username: decodedToken.username,
          favoriteGenre: decodedToken.favoriteGenre,
          id: decodedToken.id
        })
      } catch (error) {
        console.error('Error decoding token:', error)
        // If token is invalid, remove it
        localStorage.removeItem('library-user-token')
      }
    }
  }, [])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} notify={notify} setUser={setUser} />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommendations")}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} notify={notify} />
      <Recommendations show={page === "recommendations"} user={user} />
    </div>
  );
};

export default App;
