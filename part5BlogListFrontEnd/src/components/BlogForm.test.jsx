import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn() // where is vi.fn() defined? vi.fn() is a function provided by Vitest, a testing framework, to create mock functions that can be used to track calls and arguments passed to them.
  const user = userEvent.setup()

  render(<BlogForm setBlogs={createBlog} setNotification={() => {}} user={{ id: '123' }} blogs={[]} toggleVisibility={() => {}} />)

  const input = screen.getByRole('textbox', { name: /title/i }) //What is the "i" in /title/i? The "i" in /title/i is a flag that makes the regular expression case-insensitive, meaning it will match "title", "Title", "TITLE", etc.
  const createButton = screen.getByText('create')

  await user.type(input, 'testing a form...')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
})