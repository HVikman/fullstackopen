import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog, addComment } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Table, TableBody, TableContainer, TableRow, TableCell, Paper, TableHead, TextField, Button, Typography } from '@mui/material'
import { DeleteForeverSharp } from '@mui/icons-material'

const Blog = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }

    try {
      dispatch(likeBlog(updatedBlog))
      dispatch(showNotification(`You liked ${updatedBlog.title}`, 'success', 3))
    } catch (exception) {
      console.log(exception.response)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Are you sure you want to delete ${blog.title}`)) {
      try {
        dispatch(deleteBlog(blog.id))
        dispatch(showNotification(`You deleted ${blog.title}`, 'error', 3))
        navigate('/')
      } catch (exception) {
        console.log(exception.response)
      }
    }
  }

  const blogStyle = { padding: 10 }

  if (id) {
    const blog = blogs.find((blog) => blog.id === id)

    if (blog) {
      const handleCreateComment = async (event) => {
        event.preventDefault()
        const comment = event.target.comment.value

        await dispatch(addComment(id, comment))
        event.target.comment.value = ''
      }

      return (
        <div style={blogStyle}>
          <Typography variant="h3" gutterBottom align='center' sx={{ m: 2 }}>
            {blog.title} <Button variant="contained" color="error" onClick={() => handleDelete(blog)}><DeleteForeverSharp /></Button>
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="center">Author:</TableCell>
                  <TableCell align="center">{blog.author}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">URL:</TableCell>
                  <TableCell align="center">{blog.url}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="center">Added by:</TableCell>
                  <TableCell align="center">{blog.user.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Likes:</TableCell>
                  <TableCell align="center">
                    {blog.likes}

                  </TableCell>
                </TableRow>
                {user.username === blog.user.username && (
                  <TableRow>
                    <TableCell align="center" >

                    </TableCell>
                    <TableCell align="center"  >

                      <Button variant="contained" onClick={() => handleLike(blog)}>Like</Button>

                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <h3>Comments</h3>
          <form onSubmit={handleCreateComment}>
            <TextField label="Comment" name="comment" variant="outlined" fullWidth />
            <Button type="submit" variant="contained" color="primary">Post Comment</Button>
          </form>

          <TableContainer component={Paper} style={{ marginTop: 10 }}>
            <Table>
              <TableBody>
                {blog.comments.map((comment, index) => (
                  <TableRow key={index}>
                    <TableCell>{comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )
    } else {
      return <div>No blog found.</div>
    }
  }

  return (
    <div style={blogStyle}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">Title</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Author</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell align="center">
                  <Link to={`/blogs/${blog.id}`} className='link' >
                    {blog.title}
                  </Link>
                </TableCell>
                <TableCell align="center">{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Blog