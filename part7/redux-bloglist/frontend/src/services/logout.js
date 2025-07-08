import blogService from "./blogs";

export const logout = () => {
  window.localStorage.removeItem("loggedBlogAppUser");
  blogService.setToken(null);
};
