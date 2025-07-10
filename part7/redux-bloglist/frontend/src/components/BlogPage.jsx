import { useState, useEffect } from "react";
import blogService from "../services/blogs";
import { useParams } from "react-router-dom";
import CommentForm from "./CommentForm"
import { 
  Container, 
  Card, 
  Badge, 
  Button, 
  Row, 
  Col, 
  ListGroup,
  Alert,
  Spinner
} from 'react-bootstrap';

const BlogPage = ({ user }) => {
  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
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

  if (!blog) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading blog...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">{blog.title}</h2>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>URL:</strong>{' '}
                  <a 
                    href={blog.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    {blog.url}
                  </a>
                </Col>
                <Col sm={6}>
                  <strong>Author:</strong> <Badge bg="secondary">{blog.author}</Badge>
                </Col>
              </Row>
              
              <Row className="align-items-center">
                <Col sm={6}>
                  <div className="d-flex align-items-center">
                    <Badge bg="success" className="me-2">
                      {blog.likes} likes
                    </Badge>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => handleLike(blog.id)}
                    >
                      👍 Like
                    </Button>
                  </div>
                </Col>
                <Col sm={6} className="text-end">
                  {shouldShowRemoveButton && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemove(blog.id)}
                    >
                      🗑️ Remove
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h4 className="mb-0">
                🗣️ Comments ({comments.length})
              </h4>
            </Card.Header>
            <Card.Body>
              {user ? (
                <div className="mb-4">
                  <CommentForm 
                    blogId={blog.id} 
                    userId={user.id}
                  />
                </div>
              ) : (
                <Alert variant="info" className="mb-4">
                  <Alert.Heading>🤔 Want to comment?</Alert.Heading>
                  Please log in to add comments to this blog post.
                </Alert>
              )}

              {comments.length === 0 ? (
                <Alert variant="light" className="text-center">
                  No comments yet. Be the first to comment!
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {comments.map((comment, index) => (
                    <ListGroup.Item 
                      key={comment.id} 
                      className={index % 2 === 0 ? 'bg-light' : ''}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="mb-1">{comment.content}</p>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BlogPage;