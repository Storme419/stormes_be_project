const request = require('supertest')
const db = require('./../db/connection')
const seed = require('../db/seeds/seed')
const data = require('./../db/data/test-data')
const app = require('./../app')

beforeEach(() => {
    return seed(data)
})
afterAll(() => {
    return db.end()
})

describe('GET /api/topics', () => {
    test('200:an array of topic objects with slug and description properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug', expect.any(String))
                expect(topic).toHaveProperty('description', expect.any(String))
            })
        })
    })
})

describe('404 error handling', () => {
    test('404: custom error message when passed a path that is not found', () => {
        return request(app)
        .get('/api/notapath')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND')
        })
    })
})