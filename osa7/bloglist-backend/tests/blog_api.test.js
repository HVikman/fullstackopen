/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'first blog title',
    author: 'first blog author',
    url: 'first blog url',
    likes: 15
  },
  {
    title: 'second blog title',
    author: 'second blog author',
    url: 'second blog url',
    likes: 1
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('get tests', () => {

  test('2 blogs in database', async () => {
    const res= await api.get('/api/blogs')
    expect(res.body).toHaveLength(2)
  })

  test('id object is called id instead of _id', async () => {
    const res= await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
  })
})

describe('post tests', () => {
  test('adding a blog', async () => {
    const oldblogs= await api.get('/api/blogs')
    const newBlog = {
      title: 'new blog title',
      author: 'new blog author',
      url: 'new blog url',
      likes: 15
    }

    const res = await api.post('/api/blogs').send(newBlog)
    const newblogs= await api.get('/api/blogs')
    console.log(newblogs.body)
    const difference = newblogs.body.length - oldblogs.body.length
    console.log(res.body)
    expect (res.body.title).toBe('new blog title')
    expect (difference).toBe(1)
  })

  test('default likes to 0 if empty', async () => {
    const newBlog = {
      title: 'new blog title',
      author: 'new blog author',
      url: 'new blog url'
    }

    const res = await api.post('/api/blogs').send(newBlog)
    console.log(res.body)
    expect (res.body.likes).toBe(0)
  })

  test('empty title', async () => {
    const newBlog = {
      url: 'new blog url'
    }

    const res = await api.post('/api/blogs').send(newBlog)
    expect (res.status).toBe(400)
  })

  test('empty url', async () => {
    const newBlog = {
      title: 'new blog title'
    }

    const res = await api.post('/api/blogs').send(newBlog)
    expect (res.status).toBe(400)
  })
})

describe(' delete tests', () => {
  test('delete a blog', async () => {
    const blogs= await api.get('/api/blogs')
    const id= blogs.body[0].id
    console.log(id)

    const res = await api.delete(`/api/blogs/${id}`)
    expect (res.status).toBe(204)
  })
})

describe(' put tests', () => {
  test(' edit a blog', async () => {
    const blogs= await api.get('/api/blogs')
    const blog= blogs.body[0]
    const newlikes = blog.likes + 10
    const updatedBlog ={
      title: blogs.title,
      author: blog.author,
      url: blog.url,
      likes: newlikes
    }
    const res = await api.put(`/api/blogs/${blog.id}`).send(updatedBlog)

    expect (res.body.likes).toEqual(newlikes)

  })

  test('no blog found with id', async () => {

    const updatedBlog ={
      title: 'new blog title',
      author: 'new blog author',
      url: 'new blog url'
    }
    const res = await api.put('/api/blogs/64a2d3f8acc99c95318adbe3').send(updatedBlog)
    expect (res.status).toBe(404)
  })

})


