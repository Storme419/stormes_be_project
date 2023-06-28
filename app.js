const express = require('express')
const {
    getAllTopics,
    getApiDescriptions,
    getArticleById,
} = require('./db/controllers/controllers')
const {
    handlePsqlErrors
} = require('./errors')

const app = express()


app.get('/api/topics', getAllTopics)

app.get('/api', getApiDescriptions)

app.get('/api/articles/:id', getArticleById)


app.all('*', (_, res) => {
    res.status(404).send({ status: 404, msg: 'NOT FOUND'})
})

app.use(handlePsqlErrors)

module.exports = app