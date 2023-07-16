import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'


const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState: initialState.map((blogs) => ({
    title:blogs.title,
    author: blogs.author,
    url: blogs.url,
    likes:blogs.likes,
    user:blogs.user
  })),
  reducers: {

    like: (state, action) => {
      const blog = state.find((blog) => blog.id === action.payload)
      if (blog) {
        blog.likes++
        state.sort((a, b) => b.likes - a.likes)
      }
    },

    setBlogs(state, action) {
      action.payload.sort((a, b) => b.likes - a.likes)
      console.log(action.payload)
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.likes - a.likes)
    },
    remove: (state, action) => {
      const index = state.findIndex((blog) => blog.id === action.payload)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    createComment: (state, action) => {
      const { id, comment } = action.payload
      const blog = state.find(blog => blog.id === id)
      if (blog) {
        blog.comments.push(comment)
      }
      state.sort((a, b) => b.likes - a.likes)
    },
  }
})

export const { setBlogs , appendBlog, like, remove, createComment } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    console.log('something hapopens')
    const blogs = await blogService.getAll()
    console.log(blogs)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = newBlog => {
  return async dispatch => {
    try{
      const res = await blogService.create(newBlog)
      dispatch(appendBlog(res))}
    catch(error){
      console.log(error)
      dispatch(showNotification(error.response.data.error,'error',3))

    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.edit( { blog })
    dispatch(like(updatedBlog.id))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove( id)
    dispatch(remove(id))
  }
}
export const addComment = (id, comment) => {
  return async dispatch => {
    try {
      const response = await blogService.createComment(id, comment)
      dispatch(createComment({ id, comment: response.data }))
    } catch (error) {
      console.log(error)
    }
  }
}

export default blogSlice.reducer
