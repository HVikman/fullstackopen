const { Schema, model } = require('mongoose')

const userSchema = Schema({
  username: { type: String, required: true, minLength: 3, unique: true },
  name: { type: String, required: true },
  passwordHash: String,
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, user) => {
    user.id = user._id.toString()
    delete user.passwordHash
    delete user._id
    delete user.__v

  }
})

const User = model('User', userSchema)

module.exports = User