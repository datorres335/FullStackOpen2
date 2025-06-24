import { useState, forwardRef, useImperativeHandle } from 'react' 

const Blog = forwardRef(({blog, user}, refs) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = {  display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
  <div style={blogStyle}>
    <div style={hideWhenVisible}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
    </div>
    <div style={showWhenVisible}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} <button onClick={blog.onLike}>like</button>
      </div>
      <div>{user.name}</div>
    </div>
  </div>
  )
})

export default Blog