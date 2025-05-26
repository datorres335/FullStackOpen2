import axios from 'axios'
//const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = '/api/persons' // Use relative URL for deployment compatibility. This allows the app to work both in development and production environments
  // NOTE: this change in baseUrl will initially cause the frontend to not work in development mode, as the backend server is not running on the same port. 
    // You will need to set up a proxy in your frontend development server configuration (in vite.config.js) to forward requests to the backend server. Refer to vite.config.js for the proxy setup.
    // after you set up the proxy, you can remove the cors middleware from the backend server with "npm remove cors"

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

export default { getAll, create, update, remove }