import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = { // needed when the server requires authentication
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config) // the config object is passed as the third argument to the axios.post method
  return response.data
}

export default { getAll, create, setToken }