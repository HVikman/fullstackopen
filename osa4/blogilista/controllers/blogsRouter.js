const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')



//get blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, id:1 })
  res.json(blogs)

})

//add blog
blogsRouter.post('/', async (req, res) => {
  console.log(req.body, req.user)
  const user = await User.findById(req.user)
  if(!user){
    res.status(400).json({ error: 'invalid token' })
  }
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: user
  })


  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  res.status(201).json(blog)
})

//delete a blog
blogsRouter.delete('/:id', async (req, res) => {

  const blog = await Blog.findById(req.params.id)

  if(!blog){
    res.status(404).json({ error: 'blog not found' })
  }

  if( !(blog.user.toString() === req.user.toString()) ){
    console.log(blog.user.toString() + ' ' + req.user.toString())
    res.status(401).json({ error: 'not yours to delete' })
  }

  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

//edit a blog
blogsRouter.put('/:id', async (req, res) => {
  const updatedBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: req.body.user
  }


  const blog = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true, runValidators: true })
  if (!blog) {
    return res.status(404).json({ error: 'not found' })
  }else {res.status(200).json(blog)}
})

module.exports = blogsRouter