const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false) // to avoid deprecation warning
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connection to MongoDB: ', error.message);
  })

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

/*
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
*/

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!  
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    authorCount: Int!
    allAuthors(born: YesNo): [Author!]!
    findAuthor(name: String!): Author

    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    findBook(title: String!): Book
  }

  type Mutation {
    addAuthor(  # don't add id here, it will be generated automatically
      name: String!
      born: Int
    ): Author

    editAuthor(
      name: String!
      setBornTo: Int
    ): Author

    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
  }
`

const resolvers = {
  Author: {
    bookCount: root => {
      return Book.countDocuments({ author: root.id }) //books.filter(b => b.author === root.name).length
    }
  },
  Book: {
    author: (root) => {
      return Author.findById(root.author) //authors.find(a => a.name === root.author)
    }
  },
  Query: {
    authorCount: async () => Author.collection.countDocuments(), //() => authors.length,
    allAuthors: (root, args) => {
      if (!args.born) {
        return Author.find({})
      }

    const byBorn = args.born === 'YES' 
      ? { born: { $ne: null } }
      : { born: null } 

      return Author.find(byBorn)
    },
    findAuthor: (root, args) => Author.findOne({ name: args.name }), //authors.find(a => a.name === args.name),

    bookCount: () => Book.countDocuments(), //books.length,
    // allBooks: (root, args) => {
    //   if (!args.author && !args.genre) return Book.find({}) //books

    //   const byAuthor = book => args.author ? book.author === args.author : true
    //   const byGenre = book => args.genre ? book.genres.includes(args.genre) : true

    //   return books.filter(byAuthor).filter(byGenre)
    // },
    allBooks: async (root, args) => {
      // Build MongoDB filter object
      let filter = {}
      
      // Filter by author if provided
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          // If author doesn't exist, return empty array
          return []
        }
      }
      
      // Filter by genre if provided
      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }
      
      return Book.find(filter).populate('author')
    },
    findBook: (root, args) => Book.findOne({ title: args.title }) // books.find(b => b.title === args.title)
  },
  Mutation: {
    // addAuthor: (root, args) => {
    //   if (authors.find(a => a.name === args.name)) {
    //     throw new GraphQLError('Author name must be unique', {
    //       extensions: {
    //         code: 'BAD_USER_INPUT',
    //         invalidArgs: args.name
    //       }
    //     })
    //   }

    //   const author = { ...args, id: uuid() } //The id field is given a unique value using the uuid library.
    //   authors = authors.concat(author)
    //   return author
    // },
    addAuthor: async (root, args) => {
      const author = new Author({ ...args })
      
      try {
        return await author.save()
      } catch (error) {
        throw new GraphQLError('Author name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
    },

    // editAuthor: (root, args) => {
    //   const author = authors.find(a => a.name === args.name)
    //   if (!author) {
    //     return null
    //   }

    //   const updatedAuthor = { ...author, born: args.setBornTo }
    //   authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
    //   return updatedAuthor
    // },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
    },

    addBook: (root, args) => {
      if (books.find(b => b.title === args.title)) {
        throw new GraphQLError('Book title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      if (!authors.find(a => a.name === args.author)) {
        const author = { name: args.author, id: uuid(), born: null }
        authors = authors.concat(author)
      }

      const book = { ...args, id: uuid() }
      books = books.concat(book)
      return book
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})