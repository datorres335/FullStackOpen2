const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'http://testurl.com',
    likes: 10
  },
  {
    title: 'AnotherTestTitle',
    author: 'AnotherTestAuthor',
    url: 'http://anothertesturl.com',
    likes: 5
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Blog to be removed',
    author: 'Blog Author',
    url: 'http://blogtoberemoved.com',
    likes: 25
  })
  await blog.save() // does saving a blog return the saved blog? Yes, it returns the saved blog object with its _id field populated
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
}