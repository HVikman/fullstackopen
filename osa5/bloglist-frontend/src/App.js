import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'


const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const [creationVisible, setCreationVisible] = useState(false)

  let timeout

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
    const loggedUserJSON = window.localStorage.getItem('bloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])


  const handleMessage = (text, type, time) => {

    clearTimeout(timeout)
    setMessage(text)
    setMessageType(type)
    timeout = setTimeout(() => {
      setMessage(null)
    }, time)

  }

  const handleDeleteBlog = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id))
  }

  const handleLogout = () => {
    window.localStorage.removeItem('bloglistUser')
    setUser(null)
  }

  return (
    <div>
      <Notification message={message} type={messageType} />
      {user ? <><Blogs blogs={blogs} user={user} handleLogout={handleLogout} handleDeleteBlog={handleDeleteBlog}/>
        <br/>
        <CreateBlog handleMessage={handleMessage} setBlogs={setBlogs} blogs={blogs} setCreationVisible={setCreationVisible} creationVisible={creationVisible} /></>
        : <LoginForm setUser={setUser} handleMessage={handleMessage}/>}

    </div>
  )
}


const LoginForm = ({ setUser, handleMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'bloglistUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      handleMessage(`Welcome ${user.name}`, 'ok', 5000)

    } catch (exception) {
      console.log(exception.response)
      handleMessage(exception.response.data.error, 'error', 5000)
    }
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


const Blogs = ( { blogs, user, handleLogout, handleDeleteBlog } ) => {
  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <h2>blogs</h2>
      <p>logged in as {user.name} <button onClick={handleLogout}>log out</button></p>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleDeleteBlog={handleDeleteBlog} />
      )}

    </div>
  )
}

const CreateBlog = ({ handleMessage, blogs, setBlogs, setCreationVisible,creationVisible }) => {
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
      const result = await blogService.create({ title: title, url: url, author: author })
      console.log(result)
      setBlogs(blogs.concat(result))
      handleMessage(`A new blog ${title} by ${author} added`, 'ok', 3000)
      resetForm()
    } catch (exception) {
      console.log(exception.response)

      handleMessage(exception.response.data.error, 'error', 3000)
    }
  }



  return (
    <div>
      <div style={hide}>
        <button onClick={() => setCreationVisible(true)}>create</button>
      </div>


      <form onSubmit={handleSubmit} style={show}>
        <label>
        Title:
          <input type="text" name="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </label>
        <br />
        <label>
        Author:
          <input type="text" name="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </label>
        <br />
        <label>
        URL:
          <input type="text" name="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        </label>
        <button type="submit">Add blog</button>
        <button type="button" onClick={() => {setCreationVisible(false);resetForm()}}>Cancel</button>
      </form>
    </div>
  )
}
export default App