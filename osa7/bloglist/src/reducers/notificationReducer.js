import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  style: '',
  duration: 0,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      console.log(action.payload)
      state.message = action.payload.message
      state.style = action.payload.style
    },
    clearNotification: (state) => {
      state.message = ''
      state.style= ''
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions
let notificationTimeout
export const showNotification = (message,style, duration) => {
  return (dispatch) => {
    clearTimeout(notificationTimeout)
    console.log(message,style,duration)
    dispatch(setNotification({ message: message, style: style }))

    notificationTimeout = setTimeout(() => {
      dispatch(clearNotification())
    }, duration * 1000)
  }
}


export default notificationSlice.reducer