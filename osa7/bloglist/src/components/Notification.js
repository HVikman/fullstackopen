import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  console.log(notification)


  return (
    <>

      {notification.message && <>
        <Alert  severity={notification.style} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert> <br /></>
      }


    </>
  )
}
export default Notification