import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleDeleteBlog }) => {
  const [info, setInfo]= useState(false)

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes+1
    }

    try {
      const result = await blogService.edit({ blog: updatedBlog })
      console.log(result)
      blog.likes=result.likes
      setInfo(false)
    } catch (exception) {
      console.log(exception.response)
    }
  }

  const handleDelete = async () => {
    console.log(blog.id)
    try {

      const result = await blogService.remove( blog.id )
      console.log(result)
      handleDeleteBlog(blog.id)
    } catch (exception) {
      console.log(exception.response)
    }

  }

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    borderRadius:5,
    margin: 5
  }
  return(
    <div style={blogStyle}>
      <div>{blog.title} by {blog.author} <button onClick={() => info? setInfo(false):setInfo(true)}>{info ? 'hide':'show'}</button></div>
      {info ? <Info blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user}/> : ''}

    </div> )
}
const Info = ({ blog, handleLike,user,handleDelete }) => {console.log(blog); return(
  <div>
    URL: {blog.url}<br />
    Likes {blog.likes} <button onClick={handleLike}>like</button><br />
    Added by: {blog.user.username}<br />
    {(user.username === blog.user.username)?<button onClick={handleDelete}>Delete</button>:null}

  </div>
)}
Info.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  handleDelete:PropTypes.func.isRequired
}


export default Blog