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
    test('200: GET /api/topics responds with an array of topic objects with slug and description properties', () => {
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
    test('404: GET /api/articles/:article_id responds with a 404 error if path is valid but id num not found', () => {
        return request(app)
        .get('/api/articles/100')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND')
        })
    })
    test('200: GET /api/articles responds with 200 and an array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
                expect(article).toHaveProperty('author', expect.any(String))
                expect(article).toHaveProperty('title', expect.any(String))
                expect(article).toHaveProperty('article_id', expect.any(Number))
                expect(article).toHaveProperty('topic', expect.any(String))
                expect(article).toHaveProperty('created_at', expect.any(String))
                expect(article).toHaveProperty('votes', expect.any(Number))
                expect(article).toHaveProperty('article_img_url', expect.any(String))
                expect(article).toHaveProperty('comment_count', expect.any(String))
                })
            })
    })
    test('200: GET /api/articles responds with a 200 and an array of article objects that are ordered by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeSortedBy('created_at', {
                descending: true,
              })
        })
    })
    test('200: GET /api/articles responds with a 200 and an array of article objects with NO body property', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toHaveLength(13)
            articles.forEach(article => {
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('200: GET /api/articles/:article_id/comments responds with a 200 and an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author, body, article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const comments = body.comment
            expect(comments).toHaveLength(11)
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.any(String))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('body', expect.any(String))
                expect(comment.article_id).toBe(1)
            })
        })
    })
    test('200: GET /api/articles/:article_id/comments responds with a 200 and an array ordered by most recent', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const comments = body.comment
            expect(comments).toBeSortedBy('created_at', {
                descending: true,
            })
        })
    })
    test('400: GET /api/articles/:article_id/comments responds with a 400 error if id num not valid', () => {
        return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })
    test('404: GET /api/articles/:article_id/comments responds with a 404 error if id num not found', () => {
        return request(app)
        .get('/api/articles/15/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND')
        })
    })
    test('200: GET /api/users responds with a 200 and an array of all user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toHaveProperty('username', expect.any(String))
                expect(user).toHaveProperty('name', expect.any(String))
                expect(user).toHaveProperty('avatar_url', expect.any(String))
            })
        })
    })
})

describe('Post', () => {
    test('201: POST /api/articles/:id/comments adds a comment for the article with the id', () => {
        const newComment = {
            username: 'butter_bridge',
            body: "I'm enjoying this"
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: 'butter_bridge',
                body: "I'm enjoying this",
                article_id: 1
            })
        })
    })
    test('400: POST /api/articles/:id/comments responds with a 400 if username is invalid', () => {
        const newComment = {
            username: 'Storme',
            body: "I'm enjoying this"
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })
    test('400: POST /api/articles/:id/comments responds with a 400 if id is invalid', () => {
        const newComment = {
            username: 'butter_bridge',
            body: "I'm enjoying this"
        }
        return request(app)
        .post('/api/articles/nope/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })   
    test('400: POST /api/articles/:id/comments responds with a 400 if body is missing', () => {
        const newComment = {
            username: 'butter_bridge',
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })
    test('404: POST /api/articles/:id/comments responds with a 404 if id does not exist', () => {
        const newComment = {
            username: 'butter_bridge',
            body: "I'm enjoying this"
        }
        return request(app)
        .post('/api/articles/99/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND')
        })
    })
})

describe('PATCH', () => {
    test('200: PATCH /api/articles/:id responds with a 200 and updated article with votes value changed depending on inc_votes', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 101,
                article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    })
    test('200: PATCH /api/articles/:id responds with a 200 and votes are increased by value of inc_votes if more than 1', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: 10})
        .expect(200)
        .then(({body}) => {
            expect(body.article.votes).toBe(110)
        })
    })
    test('200: PATCH /api/articles/:id responds with a 200 and votes are decreased by value of inc_votes if less than 0', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: -1})
        .expect(200)
        .then(({body}) => {
            expect(body.article.votes).toBe(99)
        })
    })
    test('400: PATCH /api/articles/:id responds with a 400 if inc_votes value is invalid', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: 'string'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })
    test('400: PATCH /api/articles/:id responds with a 400 if id value is invalid', () => {
        return request(app)
        .patch('/api/articles/nope')
        .send({inc_votes: 1})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })
    test('404: PATCH /api/articles/:id responds with a 400 if id does not exist', () => {
        return request(app)
        .patch('/api/articles/99')
        .send({inc_votes: 1})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND')
        })
    })
})

describe('DELETE', () => {
    test('204: DELETE /api/comments/:id responds with a 200 and deletes the comment associated with the id of the api', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({})
        })
    })
    test('400: DELETE /api/comments/:id responds with a 400 if id is invalid', () => {
        return request(app)
        .delete('/api/comments/oops')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })
    test('404: DELETE /api/comments/:id responds with a 404 error if id num not found', () => {
        return request(app)
        .get('/api/comments/99')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND')
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
