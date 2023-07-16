import {
  Routes, Route, Link
} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import './app.css'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './reducers/notificationReducer'
import { createBlog, initializeBlogs } from './reducers/blogsReducer'
import { clearUser, login, setUser } from './reducers/userReducer'
import Users from './components/Users'
import { Container, Paper, AppBar, Toolbar, Button, Typography,Stack,TextField } from '@mui/material'

const App = () => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const [creationVisible, setCreationVisible] = useState(false)


  useEffect(() => {
    dispatch(initializeBlogs())
    const loggedUserJSON = window.localStorage.getItem('bloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }, [dispatch])





  const handleLogout = () => {
    window.localStorage.removeItem('bloglistUser')
    dispatch(clearUser())
  }



  return (
    <Container  sx={{ p: 3 }}component={Paper}>

      <Notification  />
      {user && (
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <div>
              <Button sx={{ m: 1 }} color="inherit" variant="outlined" component={Link} to="/">
                Blogs
              </Button>
              <Button sx={{ m: 1 }} color="inherit" variant="outlined" component={Link} to="/users">
                Users
              </Button>
            </div>
            <div>
              <Typography variant="subtitle1" sx={{ marginRight: '1rem' }}>
                Logged in as {user.name}
              </Typography>
              <Button sx={{ m: 1 }} color="inherit" variant="outlined" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      )}

      <Routes>
        <Route path="/blogs/:id" element={<Blog/>} />
        <Route path="/users/:id" element={<Users />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home setCreationVisible={setCreationVisible} creationVisible={creationVisible} user={user} handleLogout={handleLogout}/>} />
      </Routes>

    </Container>


  )
}


const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(login({ username, password }))
    setUsername('')
    setPassword('')

  }



  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}



const Home = ({ setCreationVisible, creationVisible }) => {
  const user = useSelector(state => state.user)
  return (
    <div>
      {user ? <> <Blog/> <br />
        <CreateBlog  setCreationVisible={setCreationVisible} creationVisible={creationVisible} /></>
        : <LoginForm />}
    </div>
  )
}

const CreateBlog = ({ setCreationVisible,creationVisible }) => {
  const dispatch = useDispatch()
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const hide = { display: creationVisible ? 'none' : '' }
  const show = { display: creationVisible ? '' : 'none' }

  const resetForm = () => {
    setAuthor('')
    setTitle('')
    setUrl('')

  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      dispatch(createBlog({ title: title, url: url, author: author }))
      dispatch(showNotification(`A new blog ${title} by ${author} added`,'success', 3))
      resetForm()
      setCreationVisible(false)
    } catch (exception) {
      console.log(exception.response)

    }
  }



  return (
    <div>
      <div style={hide}>
        <Button variant="contained" onClick={() => setCreationVisible(true)}>Create</Button>
      </div>

      <form onSubmit={handleSubmit} style={show}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            variant="outlined"
          />
          <TextField
            label="Author"
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            variant="outlined"
          />
          <TextField
            label="URL"
            type="text"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            variant="outlined"
          />
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained">Add Blog</Button>
            <Button variant="contained" onClick={() => { setCreationVisible(false); resetForm() }}>Cancel</Button>
          </Stack>
        </Stack>
      </form>
    </div>
  )
}
export default App