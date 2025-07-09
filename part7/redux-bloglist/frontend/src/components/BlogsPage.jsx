import Notification from "./Notification";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import Blog from "./Blog";
import { 
  Container,
  Row,
  Col,
  Table,
  Card,
  Badge,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";

const BlogsPage = ({ notification, user, setNotification }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const blogFormRef = useRef();
  const blogViewRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading blogs...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="my-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 text-primary">📚 Blog Collection</h1>
            <Badge bg="info" className="fs-6">
              {blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'}
            </Badge>
          </div>

          <Notification message={notification.message} color={notification.color} />
          
          {user ? (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">✍️ Share Your Thoughts</h5>
              </Card.Header>
              <Card.Body>
                <Togglable buttonLabel="📝 Create New Blog" ref={blogFormRef}>
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
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="info" className="mb-4">
              <Alert.Heading>🤔 Want to share your ideas?</Alert.Heading>
              <p>Please log in to create and manage your own blog posts.</p>
            </Alert>
          )}

          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">📖 All Blogs</h4>
            </Card.Header>
            <Card.Body className="p-0">
              {blogs.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">No blogs yet!</h5>
                  <p className="text-muted">Be the first to share something interesting.</p>
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3">📄 Title</th>
                      <th className="py-3">✍️ Author</th>
                      <th className="py-3 text-center">👍 Likes</th>
                      <th className="py-3 text-center">🗣️ Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog, index) => (
                      <tr key={blog.id} className={index % 2 === 0 ? 'table-light' : ''}>
                        <td className="py-3">
                          <Link 
                            to={`/blogs/${blog.id}`}
                            className="text-decoration-none fw-semibold"
                          >
                            {blog.title}
                          </Link>
                        </td>
                        <td className="py-3">
                          <Badge bg="secondary" className="px-2 py-1">
                            {blog.author}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <Badge bg="success" className="px-2 py-1">
                            {blog.likes}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <Badge bg="info" className="px-2 py-1">
                            {blog.comments ? blog.comments.length : 0}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {blogs.length > 0 && (
            <Card className="shadow-sm mt-4">
              <Card.Body>
                <Row className="text-center">
                  <Col md={4}>
                    <h5 className="text-primary">{blogs.length}</h5>
                    <small className="text-muted">Total Blogs</small>
                  </Col>
                  <Col md={4}>
                    <h5 className="text-success">
                      {blogs.reduce((sum, blog) => sum + blog.likes, 0)}
                    </h5>
                    <small className="text-muted">Total Likes</small>
                  </Col>
                  <Col md={4}>
                    <h5 className="text-info">
                      {[...new Set(blogs.map(blog => blog.author))].length}
                    </h5>
                    <small className="text-muted">Authors</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogsPage;