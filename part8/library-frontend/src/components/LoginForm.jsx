import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { jwtDecode } from 'jwt-decode'

const LoginForm = ({ setUser, setToken, notify }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: error => {
      notify(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      //console.log("Login successful, token:", token);
      const decodedToken = jwtDecode(token)
      
      setUser({
        username: decodedToken.username,
        favoriteGenre: decodedToken.favoriteGenre,
        id: decodedToken.id,
      })
      setToken(token)
      
      localStorage.setItem('library-user-token', token) // Where is localStorage defined? // It is a global object available in the browser environment.
    }
  }, [result.data, setToken])

  const submit = async event => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username <input 
            value={username} 
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input 
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm