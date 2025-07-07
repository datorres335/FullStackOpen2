import { useState } from "react";
import { Form, Button } from 'react-bootstrap'

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

      <Form onSubmit={addBlog}>
        <div>
          <Form.Group>
            <Form.Label>Title:</Form.Label>
            <Form.Control 
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
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Author:</Form.Label>
            <Form.Control 
              type="text"
              data-testid="author"
              value={newBlog.author}
              name="author"
              onChange={(e) =>
                handleBlogChange({
                  target: { name: "author", value: e.target.value },
                })
              }
              placeholder="Blog author"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>URL:</Form.Label>
            <Form.Control 
              type="text"
              data-testid="url"
              value={newBlog.url}
              name="url"
              onChange={(e) =>
                handleBlogChange({
                  target: { name: "url", value: e.target.value },
                })
              }
              placeholder="Blog URL"
            />
          </Form.Group>
          <input
            type="hidden"
            value={user.id}
            name="userId"
            onChange={(e) =>
              handleBlogChange({ target: { name: "userId", value: user.id } })
            }
          />
          <br />
          <Button variant="primary" type="submit">create</Button>
          <br />
        </div>
      </Form>
    </div>
  );
};

export default BlogForm;
