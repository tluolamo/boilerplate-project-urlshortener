const mongoose = require('mongoose')

// Create a simple User's schema
const counters = new mongoose.Schema({
  _id: String,
  seq_value: { type: Number, required: true }
})

const Counters = new mongoose.model('Counters', counters)

module.exports = Counters
