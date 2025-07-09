import { useState, useEffect } from "react";
import userService from "../services/users";
import { useParams, Link } from "react-router-dom";
import { 
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Alert,
  Spinner,
  Button
} from "react-bootstrap";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    userService.getById(id).then(user => {
      setUser(user);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching user:", error);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading user profile...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="my-4">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>User Not Found</Alert.Heading>
          <p>Sorry, we couldn&apos;t find the user you&apos;re looking for.</p>
          <Button as={Link} to="/users" variant="outline-primary">
            Back to Users
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col lg={8} className="mx-auto">
          {/* User Profile Header */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-0">👤 {user.name}</h2>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark" className="fs-6">
                    @{user.username}
                  </Badge>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={4}>
                  <div className="border-end">
                    <h3 className="text-primary mb-1">{user.blogs.length}</h3>
                    <small className="text-muted">Blogs Published</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border-end">
                    <h3 className="text-success mb-1">
                      {user.blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}
                    </h3>
                    <small className="text-muted">Total Likes</small>
                  </div>
                </Col>
                <Col md={4}>
                  <h3 className="text-info mb-1">
                    {user.blogs.length > 0 
                      ? Math.round(user.blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0) / user.blogs.length)
                      : 0
                    }
                  </h3>
                  <small className="text-muted">Avg Likes/Blog</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* User's Blogs */}
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">📚 Published Blogs</h4>
                <Badge bg="light" text="dark">
                  {user.blogs.length} {user.blogs.length === 1 ? 'blog' : 'blogs'}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {user.blogs.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">📝 No blogs yet!</h5>
                  <p className="text-muted">{user.name} hasn&apos;t published any blogs yet.</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {user.blogs
                    .sort((a, b) => (b.likes || 0) - (a.likes || 0)) // Sort by likes
                    .map((blog, index) => (
                      <ListGroup.Item 
                        key={blog.id || index}
                        className="d-flex justify-content-between align-items-center py-3"
                      >
                        <div className="flex-grow-1">
                          <h6 className="mb-1">
                            <Link 
                              to={`/blogs/${blog.id}`}
                              className="text-decoration-none fw-semibold"
                            >
                              {blog.title}
                            </Link>
                          </h6>
                          {blog.url && (
                            <small className="text-muted">
                              <a 
                                href={blog.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                🔗 {blog.url}
                              </a>
                            </small>
                          )}
                        </div>
                        <div className="text-end">
                          <Badge bg="success" className="me-2">
                            👍 {blog.likes || 0}
                          </Badge>
                          {index === 0 && user.blogs.length > 1 && (blog.likes || 0) > 0 && (
                            <Badge bg="warning">
                              🏆 Most Liked
                            </Badge>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              )}
            </Card.Body>
            {user.blogs.length > 0 && (
              <Card.Footer className="text-center bg-light">
                <small className="text-muted">
                  Click on any blog title to read the full post
                </small>
              </Card.Footer>
            )}
          </Card>

          {/* User Achievements */}
          {user.blogs.length > 0 && (
            <Card className="shadow-sm mt-4">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">🏆 Achievements</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {user.blogs.length >= 1 && (
                    <Col md={6} className="mb-2">
                      <Badge bg="success" className="p-2 w-100">
                        ✍️ First Blog Published
                      </Badge>
                    </Col>
                  )}
                  {user.blogs.length >= 5 && (
                    <Col md={6} className="mb-2">
                      <Badge bg="primary" className="p-2 w-100">
                        📚 Prolific Writer (5+ blogs)
                      </Badge>
                    </Col>
                  )}
                  {user.blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0) >= 10 && (
                    <Col md={6} className="mb-2">
                      <Badge bg="warning" text="dark" className="p-2 w-100">
                        ⭐ Popular Author (10+ likes)
                      </Badge>
                    </Col>
                  )}
                  {user.blogs.some(blog => (blog.likes || 0) >= 5) && (
                    <Col md={6} className="mb-2">
                      <Badge bg="info" className="p-2 w-100">
                        🔥 Viral Content (5+ likes on a blog)
                      </Badge>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Navigation */}
          <div className="text-center mt-4">
            <Button as={Link} to="/users" variant="outline-primary">
              ← Back to All Users
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;