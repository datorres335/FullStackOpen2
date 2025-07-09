import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map(blog =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      );
    }
  }
})

export const { setBlogs, appendBlog, removeBlog, updateBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  }
}

export const addBlog = blog => {
  return async dispatch => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  }
}

export const likeBlog = id => {
  return async dispatch => {
    const blogToLike = await blogService.getBlog(id);
    const updatedBlog = { ...blogToLike, likes: blogToLike.likes + 1 };
    const savedBlog = await blogService.update(id, updatedBlog);
    
    dispatch(updateBlog(savedBlog));
  }
}

export default blogSlice.reducer;