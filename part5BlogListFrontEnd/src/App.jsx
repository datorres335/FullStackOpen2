import { useState, useEffect } from 'react'
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
  // const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '', likes: 0, userId: null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, color: 'green' })

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

  // const addBlog = async (event) => {
  //   event.preventDefault()
    
  //   const blogObject = {
  //     title: newBlog.title.trim(), // Ensure title is not empty
  //     author: newBlog.author.trim(), // Ensure author is not empty
  //     url: newBlog.url.trim(), // Ensure URL is not empty
  //     likes: 0,
  //     userId: user.id, // Ensure userId is set from the logged-in user
  //   }

  //   try {
  //     const returnedBlog = await blogService.create(blogObject)

  //     setBlogs(blogs.concat(returnedBlog))
  //     setNewBlog({ title: '', author: '', url: '', likes: 0, userId: null }) // reset the form fields
  //     setNotification({ message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, color: 'green' })
  //     setTimeout(() => {
  //       setNotification({ message: null, color: 'green' })
  //     }, 5000)
  //   } catch (exception) {
  //     setNotification({ message: 'Failed to add blog', color: 'red' })
  //     setTimeout(() => {
  //       setNotification({ message: null, color: 'green' })
  //     }, 5000)
  //   }
  // }

  // const handleBlogChange = (event) => {
  //   const { name, value } = event.target
  //   setNewBlog({ ...newBlog, [name]: value }) // update the specific field in the newBlog state
  // }

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
          </p>          <Togglable buttonLabel="new blog">
            <BlogForm
              setBlogs={setBlogs}
              setNotification={setNotification}
              user={user}
              blogs={blogs}
              blogServiceCreate={blogService.create}
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