const _ = require('lodash') // lodash is a utility library that provides many useful functions for working with arrays, objects, and other data types

const dummy = (blogs) => {
  return 1
}

// this function calculates the total number of likes across all blogs
const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// this function finds the blog with the most likes
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  return blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  }, blogs[0])
}

// this function finds the author with the most blogs written
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = _.countBy(blogs, 'author') // returns an object with authors as keys and their blog counts as values
    // example output: { 'Robert C. Martin': 3, 'Edsger W. Dijkstra': 2 }
  const topAuthor = _.maxBy(Object.keys(counts), author => counts[author]) // finds the author with the maximum count
    // general usage of maxBy: _.maxBy(array, iteratee)
    // iteratee: A function that returns the value to compare for each element. (in this case)
  return {
    author: topAuthor,
    blogs: counts[topAuthor] // bracket notation is needed here because topAuthor can be a string with spaces
  }
}

// this function finds the author with the most likes across all their blogs
const mostLikes = (blog) => {
  if (blog.length === 0) return null

  const likesCount = _.groupBy(blog, 'author') // groups blogs by author
    // example output: { 'Robert C. Martin': [blog1, blog2, blog3], 'Edsger W. Dijkstra': [blog4, blog5] }
  
  const likesPerAuthor = _.mapValues(likesCount, blogs => _.sumBy(blogs, 'likes')) // sums likes for each author
    // general usage of mapValues: _.mapValues(object, iteratee)
    // iteratee: The function to apply to each value.
    // general useage of sumBy: _.sumBy(array, object_property)
    // example output: { 'Robert C. Martin': 30, 'Edsger W. Dijkstra': 12 }
  
  const topAuthor = _.maxBy(Object.keys(likesPerAuthor), author => likesPerAuthor[author]) // finds the author with the maximum likes
    // general usage of maxBy: _.maxBy(array, iteratee)
    // iteratee: A function that returns the value to compare for each element. (in this case)
  
  return {
    author: topAuthor,
    likes: likesPerAuthor[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}