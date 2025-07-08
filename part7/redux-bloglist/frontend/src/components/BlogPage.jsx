import { useState, useEffect } from "react";
import blogService from "../services/blogs";
import { useParams } from "react-router-dom";

const BlogPage = ({ user }) => {
  const [blog, setBlog] = useState(null)
  const { id } = useParams();

  useEffect(() => {
    blogService.getById(id).then(blog => setBlog(blog))
  }, [id])

  const handleLike = async (id) => {
    const updatedBlogData = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };

    try {
      const returnedBlog = await blogService.update(id, updatedBlogData);
      setBlog(returnedBlog);
    } catch (exception) {
      console.log("Error updating blog", exception);
    }
  };

  const handleRemove = async (id) => {
    if (
      !window.confirm(
        "Remove blog: " + blog.title + "?",
      )
    ) {
      return;
    }
    try {
      await blogService.remove(id);
      setBlog(null);
    } catch (exception) {
      console.log("Error removing blog", exception);
    }
  };

  const getBlogUserId = () => {
    if (!blog || !blog.userId) return null;
    if (typeof blog.userId === "object") {
      return blog.userId._id || blog.userId.id;
    }
    return blog.userId;
  };

  const blogUserId = getBlogUserId();

  const shouldShowRemoveButton =
    user && blogUserId && user.id === blogUserId.toString();
  const showRemoveButton = { display: shouldShowRemoveButton ? "" : "none" };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <h2>Blog Details</h2> */}
      <h2>{blog.title}</h2>
      <div className="url">{blog.url}</div>
      <div className="likes">
        {blog.likes} likes <button onClick={() => handleLike(blog.id)}>like</button>
      </div>
      <div>added by {blog.author}</div>
      <div>
        <button style={showRemoveButton} onClick={() => handleRemove(blog.id)}>
          remove
        </button>
      </div>
    </div>
  )
}

export default BlogPage;