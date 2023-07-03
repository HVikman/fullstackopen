const { countBy, maxBy, keys } = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  let sum = 0

  blogs.forEach(blog => {
    sum += blog.likes
  })

  return sum
}

const favoriteBlog = (blogs) => {
  let best = blogs[0]

  blogs.forEach(blog => {
    if(blog.likes > best.likes){
      best = blog
    }
  })
  return best
}

const mostBlogs = (blogs) => {
  let authors = countBy(blogs, 'author')
  let mostBlogs = maxBy(keys(authors), (author) => authors[author])

  return{
    author:mostBlogs,
    count: authors[mostBlogs]
  }

}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog, mostBlogs
}