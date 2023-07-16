import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}))

test('renders blog title and author', () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText((content, element) => {
    return content.includes('Test Blog') && element.tagName.toLowerCase() === 'div'
  })

  expect(element).toBeDefined()
})

test('calls the like event handler twice when the like button is clicked twice', () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    likes: 5,
  }

  const handleLike = jest.fn()
  const handleDelete = jest.fn()

  render(<Blog blog={blog} handleLike={handleLike} user={{ name:'john' }} handleDelete={handleDelete} />)

  const button = screen.getByText('show')
  userEvent.click(button)

  const likeButton = screen.getByText('like')
  userEvent.click(likeButton)
  userEvent.click(likeButton)

  expect(handleLike).toHaveBeenCalledTimes(2)
})
