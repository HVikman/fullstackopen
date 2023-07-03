const { sign } = require('jsonwebtoken')
const { compare } = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {

  const user = await User.findOne({ username:req.body.username })
  const passwordCorrect = user === null
    ? false
    : await compare(req.body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'wrong password or username'
    })
  }

  const token = sign({ username: user.username,id: user._id }, process.env.SECRET)

  res.status(200).send({ token, username: user.username, name: user.name, id: user._id })
})

module.exports = loginRouter