import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 0
  }

  const { container } = render(<Blog blog={blog} user={null} onLike={() => {}} onRemove={() => {}} />)
  //screen.debug() // This will log the rendered output to the console for debugging
    // you can also use screen.debug(screen.getByText('Sample Text')) to log a specific element

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Test Blog')
})

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Test Blog 2',
    author: 'Test Author 2',
    url: 'https://testblog2.com',
    likes: 0
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={null} onLike={mockHandler} onRemove={() => {}} />)
  //screen.debug() // This will log the rendered output to the console for debugging

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1) //The expectation of the test uses toHaveLength to verify that the mock function has been called exactly once
})