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

test('displays blog URL and likes when button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 10,
    user: { username: 'John Doe' }
  }

  render(<Blog blog={blog} user={ { username: 'john' } }/>)
  const user = userEvent.setup()

  await user.click(screen.getByText('show'))

  const element = screen.getByText((content, element) => {
    return content.includes('John Doe') && element.tagName.toLowerCase() === 'div'
  })

  expect(element).toBeDefined()
})