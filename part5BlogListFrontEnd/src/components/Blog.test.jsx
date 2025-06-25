import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title, author but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 0
  }

  const { container } = render(<Blog blog={blog} user={null} onLike={() => {}} onRemove={() => {}} />)
  //screen.debug() // This will log the rendered output to the console for debugging
    // you can also use screen.debug(screen.getByText('Sample Text')) to log a specific element

  const visibleDiv = container.querySelector('.hideWhenVisible')
  expect(visibleDiv).toHaveTextContent('Test Blog')
  expect(visibleDiv).toHaveTextContent('Test Author')
  expect(visibleDiv).not.toHaveTextContent('https://testblog.com')
  expect(visibleDiv).not.toHaveTextContent('like')
  
  expect(screen.getByText('view')).toBeInTheDocument()
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

// test('does not render blog URL or number of likes by default', async () => {
//   const blog = {
//     title: 'Test Blog 2',
//     author: 'Test Author 2',
//     url: 'https://testblog2.com',
//     likes: 0
//   }

//   const { container } = render(<Blog blog={blog} user={null} onLike={() => {}} onRemove={() => {}} />)

//   const title = container.querySelector('.blog')
// })