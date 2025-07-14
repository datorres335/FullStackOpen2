import { gql, useQuery, useMutation } from "@apollo/client"
import { useState } from 'react'

const ALL_AUTHORS = gql`
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

const SetBirthYear = () => {
  const [setBirthYear, { loading, error }] = useMutation(EDIT_AUTHOR)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const findAuthor = useQuery(FIND_AUTHOR, {
    variables: { nameToSearch: name },
  })

  if (loading) return <div>loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const submit = async (event) => {
    event.preventDefault()
    findAuthor.refetch()
    await setBirthYear({
      variables: {
        name,
        setBornTo: parseInt(born)
      }
    })
  }

  return (
    <div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            Name
            <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
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

      <SetBirthYear />
    </div>
  )
}

export default Authors
