import axios from "axios";
const baseUrl = "/api/blogs/:id/comments";

const getAll = (blogId) => {
  const request = axios.get(baseUrl.replace(":id", blogId));
  return request.then((response) => response.data);
}

const create = async (content, blogId, userId) => {
  const response = await axios.post(baseUrl.replace(":id", blogId), { content, blogId, userId });
  return response.data;
}

export default { getAll, create };