require('dotenv').config()

/** this project needs a db !! **/
// mongoose.set('debug', true)
// console.log(process.env.MONGO_URI)
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const app = require('./app').app

// Basic Configuration
const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Node.js listening ...')
})
