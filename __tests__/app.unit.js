/* eslint-env jest */
const request = require('supertest')
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const mongoose = require('mongoose')
const app = require('../app')

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

  test('It should return error for invalid urls', async done => {
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

  /* test('It should throw DB error in rare cases', async done => {
    const response = await request(app).post('/api/shorturl/new', 'http://www.google.com')
    await expect(response.body.error).toBe('DB error')
    done()
  }) */
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
