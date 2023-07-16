import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { showNotification } from './notificationReducer'
import blogService from '../services/blogs'

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      blogService.setToken(action.payload.token)
      return action.payload
    },
    clearUser: () => null,
  },
})

export const { setUser, clearUser } = userSlice.actions

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials)
      dispatch(setUser(user))
      window.localStorage.setItem(
        'bloglistUser', JSON.stringify(user)
      )
      dispatch(showNotification(`Welcome ${user.name}`,'success', 5))
      return user
    } catch (error) {
      dispatch(showNotification(error.response.data.error,'error', 5))
    }
  }
}

export default userSlice.reducer