/* eslint-env jest */
const request = require('supertest')
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const mongoose = require('mongoose')

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

let mongoServer

beforeAll(async () => {
  jest.resetModules()
  mongoServer = new MongoMemoryServer({
    binary: {
      version: 'latest' // or you use process.env.MONGOMS_VERSION = '4.0.0'
    }
  })
  const mongoUri = await mongoServer.getUri()
  process.env.MONGO_URI = mongoUri
  await mongoose.connect(mongoUri, {}, (err) => {
    if (err) console.error(err)
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Test Homepage', () => {
  test('It should respond to the GET method', async () => {
    const app = require('../app')
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })
})

describe('Test /api/shorturl/new', () => {
  test('It should return shortened URL for good URLs', async done => {
    const app = require('../app')
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
      done()
    }
  })

  test('It should return error for invalid urls', async () => {
    const app = require('../app')

    const badUrls = [
      'https://www.googledasfdfasfasdfdfdafdafddf.com',
      'htts://www.google.com/',
      'https://www.google.com/ /'
    ]

    for (const url of badUrls) {
      const response = await request(app).post('/api/shorturl/new', url)
      expect(response.body.error).toBe('invalid URL')
    }
  })
})

describe('Test /api/shorturl/::number::', () => {
  test('It should respond to the GET method and return 301 redirect', async () => {
    const app = require('../app')
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(301)
  })
})
