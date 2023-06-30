const express = require('express')
const {
    getAllTopics,
    getApiDescriptions,
    getArticleById,
    getAllArticles,
    getArticleComments
} = require('./db/controllers/controllers')
const {
    handlePsqlErrors,
    handleCustomErrors
} = require('./errors')

const app = express()


app.get('/api/topics', getAllTopics)

app.get('/api', getApiDescriptions)

app.get('/api/articles/:id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:id/comments', getArticleComments)


app.all('*', (_, res) => {
    res.status(404).send({ status: 404, msg: 'NOT FOUND'})
})

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

module.exports = app