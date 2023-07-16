import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import userService from '../services/users'
import {
  Link
} from 'react-router-dom'
import { Table, TableBody, TableContainer, TableRow, TableCell, Paper, TableHead, Typography } from '@mui/material'

const Users = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    userService.getAll().then(users => setUsers(users))
  }, [])

  const { id } = useParams()
  if(!users){return null}
  if (id) {
    const user = users.find((user) => user.id === id)

    if (!user) {
      return <div>User not found</div>
    }

    return (
      <div>
        <h2>{user.name}</h2>
        <h4>Added blogs</h4>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>
              {blog.title}
            </li>
          ))}</ul>
      </div>
    )
  }

  return (
    <div>
      <Typography variant="h3" gutterBottom align='center' sx={{ m: 2 }}>
      Users
      </Typography>

      <TableContainer component={Paper} >
        <Table >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">Username</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Number of Blogs</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell align="center"><Link to={`/users/${user.id}`} className='link' >{user.username}</Link></TableCell>
                <TableCell align="center">{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users