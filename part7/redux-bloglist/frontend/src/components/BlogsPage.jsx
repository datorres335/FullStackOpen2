import Notification from "./Notification";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import Blog from "./Blog";
import { Table } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";

const BlogsPage = ({ notification, user, setNotification }) => {
  const [blogs, setBlogs] = useState([]);
  const blogFormRef = useRef();
  const blogViewRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  
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
                {/* <Blog
                  key={blog.id}
                  blog={blog}
                  user={user}
                  ref={blogViewRef}
                  onLike={() => handleLike(blog.id)}
                  onRemove={() => handleRemove(blog.id)}
                /> */}
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default BlogsPage;