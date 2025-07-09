import { useState, useEffect } from "react";
import userService from "../services/users";
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
import { Link } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAll().then(users => {
      const sortedUsers = users.sort((a, b) => b.blogs.length - a.blogs.length);
      setUsers(sortedUsers);
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
          <p className="mt-2">Loading users...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 text-primary">🫂 Community Authors</h1>
            <Badge bg="info" className="fs-6">
              {users.length} {users.length === 1 ? 'author' : 'authors'}
            </Badge>
          </div>

          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">📊 Author Statistics</h4>
            </Card.Header>
            <Card.Body className="p-0">
              {users.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">No users found!</h5>
                  <p className="text-muted">Be the first to join our community.</p>
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3">#</th>
                      <th className="py-3">🙋‍♂️ Name</th>
                      <th className="py-3">🏷️ Username</th>
                      <th className="py-3 text-center">📝 Blogs Created</th>
                      <th className="py-3 text-center">🏆 Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? 'table-light' : ''}>
                        <td className="py-3 fw-bold text-muted">
                          {index + 1}
                        </td>
                        <td className="py-3">
                          <Link 
                            to={`/users/${user.id}`}
                            className="text-decoration-none fw-semibold text-primary"
                          >
                            {user.name}
                          </Link>
                        </td>
                        <td className="py-3">
                          <Badge bg="secondary" className="px-2 py-1">
                            @{user.username}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <Badge 
                            bg={user.blogs.length > 5 ? "success" : user.blogs.length > 2 ? "warning" : "info"} 
                            className="px-2 py-1"
                          >
                            {user.blogs.length}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          {index === 0 && user.blogs.length > 0 && (
                            <Badge bg="warning" className="px-2 py-1">
                              🥇 Top Author
                            </Badge>
                          )}
                          {index === 1 && user.blogs.length > 0 && (
                            <Badge bg="light" text="dark" className="px-2 py-1">
                              🥈 2nd Place
                            </Badge>
                          )}
                          {index === 2 && user.blogs.length > 0 && (
                            <Badge bg="warning" text="dark" className="px-2 py-1">
                              🥉 3rd Place
                            </Badge>
                          )}
                          {user.blogs.length === 0 && (
                            <Badge bg="light" text="muted" className="px-2 py-1">
                              New Author
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {users.length > 0 && (
            <Row className="mt-4">
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-primary">{users.length}</h3>
                    <p className="text-muted mb-0">Total Authors</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-success">
                      {users.reduce((sum, user) => sum + user.blogs.length, 0)}
                    </h3>
                    <p className="text-muted mb-0">Total Blogs</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-warning">
                      {users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.blogs.length, 0) / users.length) : 0}
                    </h3>
                    <p className="text-muted mb-0">Avg Blogs/Author</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-info">
                      {users.length > 0 ? Math.max(...users.map(user => user.blogs.length)) : 0}
                    </h3>
                    <p className="text-muted mb-0">Most Blogs</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {users.filter(user => user.blogs.length > 0).length > 0 && (
            <Card className="shadow-sm mt-4">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">🌟 Top Contributors</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {users
                    .filter(user => user.blogs.length > 0)
                    .slice(0, 3)
                    .map((user, index) => (
                      <Col md={4} key={user.id} className="text-center mb-3">
                        <div className="p-3 border rounded">
                          <div className="fs-1 mb-2">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </div>
                          <h6 className="fw-bold">
                            <Link 
                              to={`/users/${user.id}`}
                              className="text-decoration-none"
                            >
                              {user.name}
                            </Link>
                          </h6>
                          <Badge bg="primary" className="px-2 py-1">
                            {user.blogs.length} blogs
                          </Badge>
                        </div>
                      </Col>
                    ))}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UsersPage;