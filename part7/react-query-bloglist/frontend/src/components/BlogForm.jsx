import { useState } from "react";

const BlogForm = ({
  setBlogs,
  setNotification,
  user,
  blogs,
  blogServiceCreate,
  toggleVisibility,
}) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
    userId: null,
  });

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title.trim(),
      author: newBlog.author.trim(),
      url: newBlog.url.trim(),
      likes: 0,
      userId: user.id, // Ensure userId is set from the logged-in user
    };

    try {
      const returnedBlog = await blogServiceCreate(blogObject);

      setBlogs(blogs.concat(returnedBlog));
      setNewBlog({ title: "", author: "", url: "", likes: 0, userId: null }); // reset the form fields
      setNotification({
        message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        color: "green",
      });

      toggleVisibility(); // hide the form after submission
      setTimeout(() => {
        setNotification({ message: null, color: "green" });
      }, 5000);
    } catch (exception) {
      setNotification({ message: "Failed to add blog", color: "red" });
      setTimeout(() => {
        setNotification({ message: null, color: "green" });
      }, 5000);
    }
  };

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value }); // update the specific field in the newBlog state
  };

  return (
    <div className="blogForm">
      <h2>Create a New Blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            data-testid="title"
            value={newBlog.title}
            name="title"
            onChange={(e) =>
              handleBlogChange({
                target: { name: "title", value: e.target.value },
              })
            }
            placeholder="Blog title"
          />{" "}
          <br />
          author:
          <input
            data-testid="author"
            value={newBlog.author}
            name="author"
            onChange={(e) =>
              handleBlogChange({
                target: { name: "author", value: e.target.value },
              })
            }
            placeholder="Blog author"
          />{" "}
          <br />
          url:
          <input
            data-testid="url"
            value={newBlog.url}
            name="url"
            onChange={(e) =>
              handleBlogChange({
                target: { name: "url", value: e.target.value },
              })
            }
            placeholder="Blog URL"
          />{" "}
          <br />
          <input
            type="hidden"
            value={user.id}
            name="userId"
            onChange={(e) =>
              handleBlogChange({ target: { name: "userId", value: user.id } })
            }
          />
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
