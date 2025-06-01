const _ = require('lodash') // lodash is a utility library that provides many useful functions for working with arrays, objects, and other data types

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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = _.countBy(blogs, 'author') // returns an object with authors as keys and their blog counts as values
    // example output: { 'Robert C. Martin': 3, 'Edsger W. Dijkstra': 2 }
  const topAuthor = _.maxBy(Object.keys(counts), author => counts[author]) // finds the author with the maximum count
    // general usage of maxBy: _.maxBy(array, iteratee)
    // iteratee: A function that returns the value to compare for each element.
  return {
    author: topAuthor,
    blogs: counts[topAuthor] // bracket notation is needed here because topAuthor can be a string with spaces
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}