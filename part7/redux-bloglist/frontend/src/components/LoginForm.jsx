import PropTypes from "prop-types";
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>

      <Form onSubmit={handleSubmit}>
        {/* <div>
          username
          <input
            data-testid="username"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </div> */}
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control 
            data-testid="username"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </Form.Group>
        {/* <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </div> */}
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control 
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit">login</Button>
        <br />
      </Form>
    </div>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
