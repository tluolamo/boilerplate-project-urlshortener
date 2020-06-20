const mongoose = require('mongoose')

// Create a simple User's schema
const shortURL = new mongoose.Schema({
  seq: { type: Number, required: true, unique: true },
  url: { type: String, required: true, unique: true }
})

const ShortURL = new mongoose.model('ShortURL', shortURL)

module.exports = ShortURL
