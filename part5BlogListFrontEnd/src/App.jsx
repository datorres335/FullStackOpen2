import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { logout } from './services/logout'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '', likes: 0, userId: null })
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => { // this effect checks if a user is already logged in when the component mounts
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('Logged in user from userEffect:', user)
      
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
      console.log('Logged in user from handleLogin:', user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user)) // store the user in localStorage so that it persists across page reloads
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
          <input
          type='text'
          value={username} //the value attribute is used to set the initial value of the input field and ensures that the input field always reflects the current value of the username state
          name='Username' // the name attribute is used to identify the input field when the form is submitted
          onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )

  const addBlog = async (event) => {
    event.preventDefault()
    
    const blogObject = {
      title: newBlog.title.trim(), // Ensure title is not empty
      author: newBlog.author.trim(), // Ensure author is not empty
      url: newBlog.url.trim(), // Ensure URL is not empty
      likes: 0,
      userId: user.id, // Ensure userId is set from the logged-in user
    }

    console.log('Blog object being sent:', blogObject) // Debugging log

    try {
      console.log('Adding new blog:', blogObject)
      const returnedBlog = await blogService.create(blogObject)
      console.log('Blog added:', returnedBlog)

      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '', likes: 0, userId: null }) // reset the form fields
    } catch (exception) {
      setErrorMessage('Failed to add blog')
      console.error('Error adding blog:', exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value }) // update the specific field in the newBlog state
  }

  return (
    <div>
      <h2>blogs</h2>

      {user === null ?
        <div>
          <h2>Log in to application</h2>
          {loginForm()}
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
          <BlogForm
            addBlog={addBlog}
            newTitle={newBlog.title}
            handleTitleChange={(e) => handleBlogChange({ target: { name: 'title', value: e.target.value } })}
            newAuthor={newBlog.author}
            handleAuthorChange={(e) => handleBlogChange({ target: { name: 'author', value: e.target.value } })}
            newUrl={newBlog.url}
            handleUrlChange={(e) => handleBlogChange({ target: { name: 'url', value: e.target.value } })}
            userId={user.id}
            handleUserIdChange={(e) => handleBlogChange({ target: { name: 'userId', value: user.id } })}
          />
        </div>
      }
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App