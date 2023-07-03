const { hash } = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const password = req.body.password

  if (password.length < 3){
    res.status(400).json({ error: 'Password has to be atleast 3 characters' })
  } else{

    const username=req.body.username
    const name = req.body.name

    const salt = 10
    const passwordHash = await hash(req.body.password, salt)
    console.log(passwordHash)
    const user = new User({
      username,
      name,
      passwordHash,
    })
    console.log(user)

    const result = await user.save()
    res.status(201).json(result)}
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { id: 1, title: 1 })
  res.json(users)
})

module.exports = usersRouter