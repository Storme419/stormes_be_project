const request = require('supertest')
const db = require('./../db/connection')
const seed = require('../db/seeds/seed')
const data = require('./../db/data/test-data')
const app = require('./../app')
const endpoints = require('./../endpoints.json')

beforeEach(() => {
    return seed(data)
})
afterAll(() => {
    return db.end()
})

describe('GET', () => {
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
    test('200: GET /api responds with 200 and a description of the different endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
    test('200: GET /api/articles/:article_id responds with a 200 and an article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url', ()=> {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
           
        })
    })
    test('400: GET /api/articles/:article_id responds with a 400 error if id num does not exist', () => {
        return request(app)
        .get('/api/articles/banana')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
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
