import { createContext, useReducer } from 'react'

const initialState = ''

const notificationReducer = (state = initialState, action) => {

  switch (action.type) {
  case 'setMessage':
    return state = action.payload
  case 'clearMessage':
    return state = ''
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, initialState)

  const setNotification = (message) => {
    dispatch({ type: 'setMessage', payload: message })
  }

  const clearNotification = () => {
    dispatch({ type: 'clearMessage' })
  }

  return (
    <NotificationContext.Provider
      value={{ notification, setNotification, clearNotification }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext