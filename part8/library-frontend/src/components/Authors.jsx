import { gql, useQuery, useMutation } from "@apollo/client"
import { useState } from 'react'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`
const FIND_AUTHOR = gql`
  query findAuthorByName($nameToSearch: String!) {
    findAuthor(name: $nameToSearch) {
      name
      born
      id
    }
  }
`

const EDIT_AUTHOR = gql`
  mutation Mutation($name: String!, $setBornTo: Int) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      id
      born
    }
  }
`

const SetBirthYear = ({ authors }) => {
  const [setBirthYear, { loading, error }] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }] // Refetch authors after updating
  })
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  // const findAuthor = useQuery(FIND_AUTHOR, {
  //   variables: { nameToSearch: name },
  //   skip: !name, // Skip the query if name is empty
  // })

  if (loading) return <div>loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const submit = async (event) => {
    event.preventDefault()
    //findAuthor.refetch()
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
            {/* <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            /> */}
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
  const findAuthor = useQuery(FIND_AUTHOR, {
    variables: { nameToSearch: "Robert Martin" },
  })

  if (authors.loading || findAuthor.loading) {
    return <div>loading...</div>
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
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SetBirthYear authors={authors.data.allAuthors}/>
    </div>
  )
}

export default Authors
