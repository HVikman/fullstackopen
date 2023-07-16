const logger = require('./logger')
const { verify } = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.message.includes('E11000')){
    return response.status(400).json({ error: 'Username must be unique' })
  }
  if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid or missing token' })
  }

  next(error)
}

const extractTokenUser = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.split('Bearer ')[1]
    req.token = token

    const decodedToken = verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    req.user = decodedToken.id
    req.username = decodedToken.username
  }
  next()
}


module.exports = {

  errorHandler,extractTokenUser
}
