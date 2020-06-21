require('dotenv').config()

const app = require('./app').app

// Basic Configuration
const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Node.js listening ...')
})
