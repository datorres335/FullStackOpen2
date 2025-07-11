import PropTypes from "prop-types";
import { 
  Form, 
  Button, 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner
} from 'react-bootstrap';
import { useState } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { useNavigate, Link } from "react-router-dom";
import { createNotification } from "../reducers/notificationReducer";
import { loggedInUser } from "../reducers/userReducer";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      //setUser(user);
      dispatch(loggedInUser(user));
      setUsername("");
      setPassword("");
      createNotification(`Welcome back, ${user.username}!`, "success");

      navigate("/");
    } catch (exception) {
      createNotification("Wrong username or password", "danger");
      setTimeout(() => {
        // setNotification({ message: null, color: "success" });
        createNotification("", "success");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      // style={{
      //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      // }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <Card.Header 
                className="text-white text-center border-0"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px 15px 0 0'
                }}
              >
                <h3 className="mb-0">🔐 Welcome Back</h3>
                <p className="mb-0 mt-2 opacity-75">Sign in</p>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark">
                      👤 Username
                    </Form.Label>
                    <Form.Control 
                      data-testid="username"
                      type="text"
                      value={username}
                      name="Username"
                      placeholder="Enter your username"
                      onChange={({ target }) => setUsername(target.value)}
                      style={{ 
                        borderRadius: '10px',
                        border: '2px solid #e9ecef',
                        padding: '12px'
                      }}
                      disabled={loading}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      🔒 Password
                    </Form.Label>
                    <Form.Control 
                      data-testid="password"
                      type="password"
                      value={password}
                      name="Password"
                      placeholder="Enter your password"
                      onChange={({ target }) => setPassword(target.value)}
                      style={{ 
                        borderRadius: '10px',
                        border: '2px solid #e9ecef',
                        padding: '12px'
                      }}
                      disabled={loading}
                      required
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 py-3 fw-semibold border-0"
                    style={{ 
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                    disabled={loading || !username.trim() || !password.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner 
                          as="span" 
                          animation="border" 
                          size="sm" 
                          role="status" 
                          aria-hidden="true" 
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      '🚀 Sign In'
                    )}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center bg-light border-0" style={{ borderRadius: '0 0 15px 15px' }}>
                <small className="text-muted">
                  <Link to="/register" className="text-decoration-none fw-semibold">
                    Create an account
                  </Link>
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginForm;