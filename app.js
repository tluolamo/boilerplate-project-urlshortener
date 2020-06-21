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
// mongoose.set('debug', true)
// console.log(process.env.MONGO_URI)
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
  const dbErr = { error: 'DB error' }
  const query = { url: urlStr }

  let myURL, shortURLRec, data
  try {
    // parse the url, this should throw type error for invalid url
    myURL = new url.URL(urlStr)
    // console.log(myURL)
  } catch (err) {
    // console.log(err)
    data = { error: 'invalid URL' }
  }
  if (myURL) {
    // we have valid url
    try {
      // first check if the record exists in the db, this is to prevent creating new sequence number every time we run this code.
      shortURLRec = await ShortURL.findOne(query)
    } catch (err) {
      console.log(err)
      data = dbErr
    }
    // entry doesn't exist in the db
    if (!shortURLRec) {
      // try find it once more incase race condition and if it doesn't exists insert it with new sequence number instead
      try {
        shortURLRec = await ShortURL.findOneAndUpdate(
          query,
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
      } catch (err) {
        console.log(err)
        data = dbErr
      }
    }
  }
  // set the return data correctly if there were no errors
  if (!data) {
    data = { original_url: myURL.host, short_url: shortURLRec.seq }
  }

  res.json(data)
})

// this is to keep track of auto incrment field
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counters.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq_value: 1 } },
    { new: true, upsert: true })
  return sequenceDocument.seq_value
}

module.exports = app
