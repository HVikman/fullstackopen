const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = Book.find({})

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          query = query.where('author').equals(author._id)
        } else {
          return []
        }
      }

      if (args.genre) {
        query = query.where('genres').in([args.genre])
      }

      return query.populate('author').exec()
    },
    allAuthors: async () => {

      const authors = await Author.find({})
      const bookCountsPromises = authors.map(async author => {
        const bookCount = await Book.countDocuments({ author: author._id })
        return { ...author._doc, bookCount }
      })

      const allAuthorsWithCount = await Promise.all(bookCountsPromises)
      return allAuthorsWithCount

    },
    me: (root, args, context) => {
      const currentUser = context.currentUser
      return currentUser ? currentUser : null
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      console.log(args, context)
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({
          name: args.author
        })
        try {
          await author.save()
        }catch (err){
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              err
            }
          })}
      }
      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      }catch (err){
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            err
          } })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book

    },
    editAuthor: async (root, args, context) => {
      console.log(args, context)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (author) {
        console.log(author)
        author.born = args.setBornTo
        try {
          await author.save()
        }catch (err){
          throw new GraphQLError('Editing author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.setBornTo,
              err
            }
          })}
      }
      return null
    },
    createUser: async (root, args) => {

      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('User creation failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }

      return user
    },

    login: async (root, args) => {
      const password = 'secret'
      const user = await User.findOne({ username: args.username })

      if (!user ) {
        throw new GraphQLError('user not found', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (args.password !== password ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}
module.exports = resolvers