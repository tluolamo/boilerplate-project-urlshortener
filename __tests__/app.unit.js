/* eslint-env jest */
const request = require('supertest')
const app = require('../app')

/* describe('Test Homepage', () => {
  test('It should respond to the GET method', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })
}) */

describe('Test /api/shorturl/new', () => {
  test('It should return shortened URL for good URLs', async done => {
    const goodUrls = [
      'https://www.google.com/'
    ]

    for (const url of goodUrls) {
      // console.log({ url })
      const response = await request(app).post('/api/shorturl/new').send({ url })
      // const response = await request(app).post('/api/shorturl/new').send({ something: 'hello' })

      expect(response.statusCode).toBe(200)
      expect(response.body.original_url).toBe('www.google.com')
      expect(typeof response.body.short_url).toBe('number')
      done()
    }
  })

  /* test('It should return error for invalid urls', async () => {
    const badUrls = [
      'https://www.googledasfdfasfasdfdfdafdafddf.com',
      'htts://www.google.com/',
      'https://www.google.com/ /'
    ]

    for (const url of badUrls) {
      const response = await request(app).post('/api/shorturl/new', url)
      expect(response.body).toBe('{"error":"invalid URL"}')
    }
  }) */
})

/* describe('Test /api/shorturl/::number::', () => {
  test('It should respond to the GET method and return 301 redirect', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(301)
  })
}) */

// /api/shorturl/3

/*
1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. *HINT*: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.
*/
