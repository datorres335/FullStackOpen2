import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let container
let mockHandler
beforeEach(() => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 0
  }

  mockHandler = vi.fn();
  ({ container } = render(<Blog blog={blog} user={null} onLike={mockHandler} onRemove={() => {}} />))
})

test('renders title, author but not url or likes by default', () => {
    //screen.debug() // This will log the rendered output to the console for debugging
    // you can also use screen.debug(screen.getByText('Sample Text')) to log a specific element

  const visibleDiv = container.querySelector('.hideWhenVisible')
  expect(visibleDiv).toHaveTextContent('Test Blog')
  expect(visibleDiv).toHaveTextContent('Test Author')
  expect(visibleDiv).not.toHaveTextContent('https://testblog.com')
  expect(visibleDiv).not.toHaveTextContent('like')
  
  expect(screen.getByText('view')).toBeInTheDocument()
})

test('clicking the like button calls event handler once', async () => {
  const user = userEvent.setup()
  
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  
  const likeButton = screen.getByText('like')
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(1) //The expectation of the test uses toHaveLength to verify that the mock function has been called exactly once
})

test('blog\'s url and num of likes are shown when view button clicked', async () => {
  const user = userEvent.setup()
  
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  
  const visibleUrl = container.querySelector('.url')
  expect(visibleUrl).toHaveTextContent('https://testblog.com')

  const visibleLikes = container.querySelector('.likes')
  expect(visibleLikes).toHaveTextContent('likes 0')
})

test('like button is able to be clicked twice', async () => {
  const user = userEvent.setup()
  
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  
  const visibleUrl = container.querySelector('.url')
  expect(visibleUrl).toHaveTextContent('https://testblog.com')

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})