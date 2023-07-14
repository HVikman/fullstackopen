import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  duration: 0,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      console.log(action.payload)
      state.message = action.payload.message
    },
    clearNotification: (state) => {
      state.message = ''
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions
let notificationTimeout
export const showNotification = (message, duration) => {
  return (dispatch) => {
    clearTimeout(notificationTimeout)
    console.log(message,duration)
    dispatch(setNotification({ message: message }))

    notificationTimeout = setTimeout(() => {
      dispatch(clearNotification())
    }, duration * 1000)
  }
}


export default notificationSlice.reducer