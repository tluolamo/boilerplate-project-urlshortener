/* eslint-env jest */
const request = require('supertest')
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const mongoose = require('mongoose')
const App = require('../app')
const app = App.app
const ShortURL = App.ShortURL
const Counters = App.Counters

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

let mongoServer

beforeAll(async () => {
  // jest.resetModules()
  mongoServer = new MongoMemoryServer({
    binary: {
      version: 'latest' // or you use process.env.MONGOMS_VERSION = '4.0.0'
    }
  })
  const mongoUri = await mongoServer.getUri()
  await mongoose.connect(mongoUri, {}, (err) => {
    if (err) console.error(err)
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Test Homepage', () => {
  test('It should respond to the GET method', async done => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
    done()
  })
})

describe('Test /api/shorturl/new', () => {
  test('It should return shortened URL for good URLs', async done => {
    const goodUrls = [
      'https://www.google.com/'
    ]

    for (const url of goodUrls) {
      // console.log({ url })
      const response = await request(app).post('/api/shorturl/new').send(`url=${url}`)
      // const response = await request(app).post('/api/shorturl/new').send({ something: 'hello' })

      expect(response.statusCode).toBe(200)
      expect(response.body.original_url).toBe('www.google.com')
      expect(typeof response.body.short_url).toBe('number')
    }
    done()
  })

  test('It should return Invalid URL error for invalid urls', async done => {
    const badUrls = [
      'https://www.googledasfdfasfasdfdfdafdafddf.com',
      'htts://www.google.com/',
      'https://www.google.com/ /'
    ]

    for (const url of badUrls) {
      const response = await request(app).post('/api/shorturl/new', url)
      await expect(response.body.error).toBe('invalid URL')
    }
    done()
  })

  test('It should return DB error in rare cases', async done => {
    // test ShortURL findOne handling
    let orig = ShortURL.findOne
    ShortURL.findOne = jest.fn()
    ShortURL.findOne.mockImplementation(() => {
      throw new Error()
    })
    let response = await request(app).post('/api/shorturl/new').send('url=https://www.google.com/')
    await expect(response.body.error).toBe('DB error')
    ShortURL.findOne = orig

    // test ShortURL findOneAndUpdate handling
    orig = ShortURL.findOneAndUpdate
    ShortURL.findOneAndUpdate = jest.fn()
    ShortURL.findOneAndUpdate.mockImplementation(() => {
      throw new Error()
    })
    response = await request(app).post('/api/shorturl/new').send('url=https://www.google.com/somethingnew')
    await expect(response.body.error).toBe('DB error')
    ShortURL.findOneAndUpdate = orig

    // finally test Counters findByIdAndUpdate
    orig = Counters.findByIdAndUpdate
    Counters.findByIdAndUpdate = jest.fn()
    Counters.findByIdAndUpdate.mockImplementation(() => {
      throw new Error()
    })
    response = await request(app).post('/api/shorturl/new').send('url=https://www.google.com/somethingnew')
    // console.log(response.body)
    await expect(response.body.error).toBe('DB error')
    Counters.findByIdAndUpdate = orig

    done()
  })
})

describe('Test /api/shorturl/::number::', () => {
  test('It should respond to the GET method and return 301 redirect', async done => {
    const response = await request(app).get('/api/shorturl/1')
    expect(response.statusCode).toBe(301)
    done()
  })

  test('It should return error if no record exists for the id', async done => {
    const response = await request(app).get('/api/shorturl/9999')
    expect(response.body.error).toBe('No such record')
    done()
  })
})
