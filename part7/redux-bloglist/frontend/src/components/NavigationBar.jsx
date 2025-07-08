import { Navbar, Nav } from 'react-bootstrap'
import { 
  useMatch, 
  Routes, 
  Route, 
  Link,
  useNavigate
} from 'react-router-dom'
import LoginForm from './LoginForm'
import BlogsPage from './BlogsPage'
import { logout } from "../services/logout";

const NavigationBar = ({ 
  user,
  setUser,
  notification, 
  setNotification,
 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/"); // Handle navigation in the component
  };

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/blogs">Blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">Users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user
                ? <span style={padding}>
                    <em>{user.username} logged in</em>
                    <button 
                      onClick={handleLogout}
                      style={{ marginLeft: '10px' }}
                    >
                      logout
                    </button>
                  </span>
                : <Link style={padding} to="/login">Login</Link>
              }
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/blogs" element={
          <BlogsPage
            notification={notification}
            user={user}
            setNotification={setNotification}
          />
        } />
        <Route path="/users" element={<div>Users Page</div>} />
        <Route path="/login" element={
          <LoginForm
            setUser={setUser}
            setNotification={setNotification}
          />
        } />
        <Route path="/" element={
          <BlogsPage
            notification={notification}
            user={user}
            setNotification={setNotification}
          />
        } />
      </Routes>
    </div>
  )
}

export default NavigationBar