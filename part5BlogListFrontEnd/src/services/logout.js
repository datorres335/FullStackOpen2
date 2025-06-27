import blogService from './blogs'

export const logout = () => {
  window.localStorage.removeItem('loggedBlogAppUser')
  blogService.setToken(null)
  window.location.href = '/' // Redirecting to home page
}