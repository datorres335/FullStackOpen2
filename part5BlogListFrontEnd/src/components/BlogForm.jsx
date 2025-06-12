const BlogForm = ({addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange, newUrl, handleUrlChange, userId, handleUserIdChange}) => {
  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={newTitle}
          onChange={handleTitleChange}
        /> <br />
        author:
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
        /> <br />
        url:
        <input
          value={newUrl}
          onChange={handleUrlChange}
        /> <br />
        <input
          type="hidden"
          value={userId}
          onChange={handleUserIdChange}
        />
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm