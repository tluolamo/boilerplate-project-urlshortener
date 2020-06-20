'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const url = require('url')
// const validator = require('validator')
// var mongo = require('mongodb')
const mongoose = require('mongoose')

const cors = require('cors')

const Counters = require('./counters')
const ShortURL = require('./shortURL')

const app = express()

/** this project needs a db !! **/
mongoose.set('debug', true)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', async (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html')
})

// your first API endpoint...
app.post('/api/shorturl/new', async (req, res) => {
  // console.log(req.body)
  const urlStr = req.body.url
  let myURL
  let data = { error: 'invalid URL' }

  try {
    // parse the url, this should throw type error for invalid url
    myURL = new url.URL(urlStr)
    console.log(myURL)
  } catch (err) {
    console.log(err)
  }

  if (myURL) {
    try {
      // we have valid url, lets check the db for existing entry, returns existing or inserts new
      const entry = await ShortURL.findOneAndUpdate(
        { url: urlStr },
        {
          $setOnInsert: {
            seq: await getNextSequenceValue('shortURL'),
            url: urlStr
          }
        },
        {
          new: true, // return new doc if one is upserted
          upsert: true // insert the document if it does not exist
        }
      )

      // set the return data set correctly
      data = { original_url: myURL.host, short_url: entry.seq }
    } catch (err) {
      console.log(err)
      data.error = 'DB error'
    }
  }

  res.json(data)
})
// {"_id":"shortURL","value":{"$numberLong":"0"}}
// this is to keep track of auto incrment field
const getNextSequenceValue = async (sequenceName) => {
  console.log(Buffer.byteLength(sequenceName, 'utf8'))
  const sequenceDocument = await Counters.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq_value: 1 } },
    { new: true, upsert: true })
  return sequenceDocument.seq_value
}

// find by url
const findByURL = async (url) => {
  const data = await ShortURL.find({ url })
}

module.exports = app
