import axios from "axios";
const baseUrl = "/api/blogs/:id/comments";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async (blogId) => {
  const url = `/api/blogs/${blogId}/comments`;
  const response = await axios.get(url);
  return response.data;
};

const create = async (content, blogId, userId) => {
  const config = {
    headers: { Authorization: token },
  };

  const url = `/api/blogs/${blogId}/comments`;
  
  const response = await axios.post(url, { content, blogId, userId }, config);
  return response.data;
};

export default { getAll, create, setToken };