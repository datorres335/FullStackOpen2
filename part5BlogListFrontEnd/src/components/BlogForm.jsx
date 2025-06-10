const BlogForm = ({addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange, newUrl, handleUrlChange, userId, handleUserIdChange}) => {
  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={newTitle}
          name="Title"
          onChange={handleTitleChange}
        /> <br />
        author:
        <input
          type="text"
          value={newAuthor}
          name="Author"
          onChange={handleAuthorChange}
        /> <br />
        url:
        <input
          type="text"
          value={newUrl}
          name="Url"
          onChange={handleUrlChange}
        /> <br />
        <input
          type="hidden"
          value={userId}
          name="UserId"
          onChange={handleUserIdChange}
        />
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm