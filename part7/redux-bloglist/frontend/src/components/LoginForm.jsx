import PropTypes from "prop-types";
import { Form, Button } from 'react-bootstrap'
import { useState } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { useNavigate } from "react-router-dom";

const LoginForm = ({
  setUser,
  setNotification
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
      event.preventDefault();

      try {
        const user = await loginService.login({
          username,
          password,
        });

        window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user)); // store the user in localStorage so that it persists across page reloads
        blogService.setToken(user.token);

        setUser(user);
        setUsername("");
        setPassword("");

        navigate("/");
      } catch (exception) {
        setNotification({ message: "Wrong username or password", color: "danger" });
        setTimeout(() => {
          setNotification({ message: null, color: "success" });
        }, 5000);
      }
    };

  return (
    <div>
      <h2>Login</h2>

      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control 
            data-testid="username"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control 
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
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
  setUser: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default LoginForm;
