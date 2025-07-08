import { Navbar, Nav } from 'react-bootstrap'
import { 
  useMatch, 
  Routes, 
  Route, 
  Link
} from 'react-router-dom'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import BlogsPage from './BlogsPage'

const NavigationBar = ({ 
  user, 
  logout, 
  setUser,
  notification, 
  setNotification,
 }) => {
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
                      onClick={() => {
                        logout();
                        setUser(null);
                      }}
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
        <Route path="/" element={<div>Blogs Page</div>} />
      </Routes>
    </div>
  )
}

export default NavigationBar