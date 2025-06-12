import { useState, useEffect, useRef } from 'react' //What is useRef used for? It is used to create a mutable object that persists for the full lifetime of the component. It can be used to access a DOM element directly or to store any mutable value that does not cause re-rendering when changed.
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { logout } from './services/logout'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, color: 'green' })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => { // this effect checks if a user is already logged in when the component mounts
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user)) // store the user in localStorage so that it persists across page reloads
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', color: 'red' })
      setTimeout(() => {
        setNotification({ message: null, color: 'green' })
      }, 5000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} color={notification.color} />
      {user === null ?
        <div>
          <Togglable buttonLabel="login">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </div>
        :
        <div>
          <p>
            {user.name} logged in
            <button onClick={() =>
              {
                logout()
                setUser(null)
              }
              }>
              logout
            </button>
          </p>          
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              setBlogs={setBlogs}
              setNotification={setNotification}
              user={user}
              blogs={blogs}
              blogServiceCreate={blogService.create}
              toggleVisibility={() => {blogFormRef.current.toggleVisibility()}}
            />
          </Togglable>
        </div>
      }
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App