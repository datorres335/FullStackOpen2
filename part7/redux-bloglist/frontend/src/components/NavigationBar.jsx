import { Navbar, Nav, Button, Badge, Container } from 'react-bootstrap'
import { 
  useMatch, 
  Routes, 
  Route, 
  Link,
  useNavigate
} from 'react-router-dom'
import LoginForm from './LoginForm'
import BlogsPage from './BlogsPage'
import BlogPage from './BlogPage';
import { logout } from "../services/logout";
import UsersPage from './UsersPage';
import UserPage from './UserPage';

const NavigationBar = ({ 
  user,
  setUser
 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            📚🤓🙈 Redux Blog Hub
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/blogs" className="text-light fw-semibold mx-2">
                📖 Blogs
              </Nav.Link>
              <Nav.Link as={Link} to="/users" className="text-light fw-semibold mx-2">
                👥 Users
              </Nav.Link>
            </Nav>
            
            <Nav className="align-items-center">
              {user ? (
                <div className="d-flex align-items-center">
                  <Badge bg="info" className="me-3 px-3 py-2">
                    👋 Welcome, {user.username}!
                  </Badge>
                  <Button 
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                    className="fw-semibold"
                  >
                    🚪 Logout
                  </Button>
                </div>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <Button variant="outline-light" size="sm" className="fw-semibold">
                    🔐 Login
                  </Button>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Routes>
        <Route path="/blogs" element={
          <BlogsPage
            user={user}
          />
        } />
        <Route path="/blogs/:id" element={
          <BlogPage
            user={user}
          />
        } />
        <Route path="/users" element={
          <UsersPage />
        } />
        <Route path="/users/:id" element={
          <UserPage />
        } />
        <Route path="/login" element={
          <LoginForm
            setUser={setUser}
          />
        } />
        <Route path="/" element={
          <BlogsPage
            user={user}
          />
        } />
      </Routes>
    </div>
  )
}

export default NavigationBar