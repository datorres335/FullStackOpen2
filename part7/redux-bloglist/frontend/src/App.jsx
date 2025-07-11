import { useState, useEffect } from "react"; //What is useRef used for? It is used to create a mutable object that persists for the full lifetime of the component. It can be used to access a DOM element directly or to store any mutable value that does not cause re-rendering when changed.
import blogService from "./services/blogs";
import NavigationBar from "./components/NavigationBar";
import { useDispatch } from "react-redux";
import { loggedInUser } from "./reducers/userReducer";

const App = () => {
  //const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // this effect checks if a user is already logged in when the component mounts
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      //setUser(user);
      dispatch(loggedInUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div className="container">
      <NavigationBar />
    </div>
  );
};

export default App;
