import { useQuery, useMutation, useSubscription } from "@apollo/client"
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR, BOOK_ADDED, AUTHOR_ADDED } from "../queries"

const SetBirthYear = ({ authors }) => {
  const [setBirthYear ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }] // Refetch authors after updating
  })
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (!name || !born) {
      alert('Please select an author and enter a birth year')
      return
    }    

    await setBirthYear({
      variables: {
        name,
        setBornTo: parseInt(born)
      }
    })

    setName('')
    setBorn('')
    alert('Author birth year updated successfully!')
  }

  return (
    <div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            Name
            <select
              value={name}
              onChange={({ target }) => setName(target.value)}
            >
              <option value="">Select an author...</option>
              {authors.map(author => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
              placeholder="Enter birth year"
            />
          </label>
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS)

    useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      
      client.cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
        if (!data) return data
        
        return {
          allAuthors: data.allAuthors.map(author => {
            if (author.id === addedBook.author.id) {
              return {
                ...author,
                authorOf: [...author.authorOf, addedBook],
                bookCount: author.bookCount + 1
              }
            }
            return author
          })
        }
      })
      
      console.log('Authors view updated for new book:', addedBook.title)
    }
  })

    useSubscription(AUTHOR_ADDED, {
    onData: ({ data, client }) => {
      const addedAuthor = data.data.authorAdded
      
      client.cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
        if (!data) return data
        
        const authorExists = data.allAuthors.some(author => author.id === addedAuthor.id)
        if (authorExists) return data
        
        return {
          allAuthors: [...data.allAuthors, addedAuthor]
        }
      })
      
      console.log('New author added to view:', addedAuthor.name)
    }
  })

  if (authors.loading) {
    return <div>loading...</div>
  }
  if (authors.error) {
    return <div>Error: {authors.error.message}</div>
  }
  if (!authors.data || !authors.data.allAuthors) {
    return <div>No authors found</div>
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born:</th>
            <th>Book Count:</th>
            <th>Author Of:</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
              <td>
                {a.authorOf.map(book => `${book.title} ${book.published}`).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SetBirthYear authors={authors.data.allAuthors}/>
    </div>
  )
}

export default Authors
