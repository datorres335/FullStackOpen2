const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

//when comparing objects, the deepStrictEqual method is probably what you want to use, it ensures that the objects have the same attributes. 
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  return blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  }, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}