import { useState, useEffect } from "react";
import userService from "../services/users";
import { useParams } from "react-router-dom";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    userService.getById(id).then(user => setUser(user));
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs.map((blog, index) => (
          <li key={blog.id || index}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserPage;