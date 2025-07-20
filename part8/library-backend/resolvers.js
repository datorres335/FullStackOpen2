const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Author: {
    bookCount: async root => {
      return await Book.countDocuments({ author: root.id }) //books.filter(b => b.author === root.name).length
    }
  },
  Book: {
    author: async (root) => {
      return await Author.findById(root.author) //authors.find(a => a.name === root.author)
    }
  },
  Query: {
    authorCount: async () => Author.collection.countDocuments(), //() => authors.length,
    allAuthors: async (root, args) => {
      if (!args.born) {
        return await Author.find({})
      }

    const byBorn = args.born === 'YES' 
      ? { born: { $ne: null } }
      : { born: null } 

      return await Author.find(byBorn)
    },
    findAuthor: async (root, args) => await Author.findOne({ name: args.name }), //authors.find(a => a.name === args.name),

    bookCount: async () => await Book.countDocuments(), //books.length,

    allBooks: async (root, args) => {
      let filter = {}
      
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          return []
        }
      }
      
      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }
      
      return await Book.find(filter).populate('author')
    },
    findBook: async (root, args) => await Book.findOne({ title: args.title }), // books.find(b => b.title === args.title)

    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addAuthor: async (root, args, context) => {
      const author = new Author({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not Authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Author name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      pubsub.publish('AUTHOR_ADDED', { authorAdded: author })

      return author
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        return await author.save()
      } catch (error) {
        throw new GraphQLError('Error updating author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
    },

    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not Authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ 
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres
      })

      let populatedBook
      try {
        const savedBook = await book.save()
        populatedBook = await Book.findById(savedBook._id).populate('author')
      } catch (error) {
        throw new GraphQLError('Book title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
      return populatedBook
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      
      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError('Error creating user', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'password') {
        throw new GraphQLError('Wrong Credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = {
        username: user.username,
        favoriteGenre: user.favoriteGenre,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    authorAdded: {
      subscribe: () => pubsub.asyncIterator(['AUTHOR_ADDED'])
    },
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers