import axios from "axios";
const baseUrl = "/api/blogs/:id/comments";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = (blogId) => {
  const request = axios.get(baseUrl.replace(":id", blogId));
  return request.then((response) => response.data);
}

const create = async (content, blogId, userId) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl.replace(":id", blogId), { content, blogId, userId }, config);
  return response.data;
}

export default { getAll, create, setToken };