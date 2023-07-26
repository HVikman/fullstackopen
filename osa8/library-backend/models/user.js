const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: String,
  favoriteGenre: String
})

module.exports = mongoose.model('User', schema)