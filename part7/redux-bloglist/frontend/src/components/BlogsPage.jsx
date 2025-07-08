import Notification from "./Notification";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import Blog from "./Blog";
import { Table } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import blogService from "../services/blogs";

const BlogsPage = ({ notification, user, setNotification }) => {
  const [blogs, setBlogs] = useState([]);
  const blogFormRef = useRef();
  const blogViewRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  
  const handleLike = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    const updatedBlogData = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };

    try {
      const returnedBlog = await blogService.update(id, updatedBlogData);
      setBlogs(
        blogs
          .map((b) => (b.id === id ? returnedBlog : b))
          .sort((a, b) => b.likes - a.likes),
      );
    } catch (exception) {
      setNotification({ message: "Error updating blog", color: "danger" });
      setTimeout(() => {
        setNotification({ message: null, color: "success" });
      }, 5000);
    }
  };

  const handleRemove = async (id) => {
    if (
      !window.confirm(
        "Remove blog: " + blogs.find((b) => b.id === id).title + "?",
      )
    ) {
      return;
    }
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (exception) {
      setNotification({ message: "Error removing blog", color: "danger" });
      setTimeout(() => {
        setNotification({ message: null, color: "success" });
      }, 5000);
    }
  };
  
  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} color={notification.color} />
      {user === null ? (
        <div>
        </div>
      ) : (
        <div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              setBlogs={setBlogs}
              setNotification={setNotification}
              user={user}
              blogs={blogs}
              blogServiceCreate={blogService.create}
              toggleVisibility={() => {
                blogFormRef.current.toggleVisibility();
              }}
            />
          </Togglable>
        </div>
      )}

      <Table striped>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Blog
                  key={blog.id}
                  blog={blog}
                  user={user}
                  ref={blogViewRef}
                  onLike={() => handleLike(blog.id)}
                  onRemove={() => handleRemove(blog.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default BlogsPage;