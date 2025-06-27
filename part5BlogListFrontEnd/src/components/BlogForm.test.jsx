import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn() // where is vi.fn() defined? vi.fn() is a function provided by Vitest, a testing framework, to create mock functions that can be used to track calls and arguments passed to them.
  const user = userEvent.setup()

  render(<BlogForm blogServiceCreate={createBlog} setBlogs={() => {}} setNotification={() => {}} user={{ id: '123' }} blogs={[]} toggleVisibility={() => {}} />)

  const titleInput = screen.getByPlaceholderText('Blog title')
  const authorInput = screen.getByPlaceholderText('Blog author')
  const urlInput = screen.getByPlaceholderText('Blog URL')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'author name')
  await user.type(urlInput, 'https://testblog.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('author name')
  expect(createBlog.mock.calls[0][0].url).toBe('https://testblog.com')
})