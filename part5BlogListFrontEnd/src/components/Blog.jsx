import { useState, forwardRef, useImperativeHandle } from 'react'

const Blog = forwardRef(({ blog, user, onLike, onRemove }, refs) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = {  display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const getBlogUserId = () => {
    if (!blog.userId) return null
    if (typeof blog.userId === 'object') {
      return blog.userId._id || blog.userId.id
    }
    return blog.userId
  }

  const blogUserId = getBlogUserId()

  const shouldShowRemoveButton = user && blogUserId && user.id === blogUserId.toString()
  const showRemoveButton = { display: shouldShowRemoveButton ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
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
        likes {blog.likes} <button onClick={onLike}>like</button>
      </div>
      <div>{user !== null ? user.name : ''}</div>
      <div><button style={showRemoveButton} onClick={onRemove}>remove</button></div>
    </div>
  </div>
  )
})

Blog.displayName = 'Blog' // this is necessary for the component to be recognized by React DevTools

export default Blog