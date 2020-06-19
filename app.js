'use strict'

var express = require('express')
// var mongo = require('mongodb')
// var mongoose = require('mongoose')

var cors = require('cors')

var app = express()

/** this project needs a db !! **/
// mongoose.connect(process.env.DB_URI);

app.use(cors())

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

module.exports = app