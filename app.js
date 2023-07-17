const cors = require('cors')
const express = require('express')
const {
    getAllTopics,
    getApiDescriptions,
    getArticleById,
    getAllArticles,
    getArticleComments,
    getAllUsers,
    postArticleComment,
    patchArticleVotes,
    deleteComment
} = require('./db/controllers/controllers')
const {
    handlePsqlErrors,
    handleCustomErrors
} = require('./errors')

const app = express()
app.use(express.json())

app.use(cors())

app.get('/api/topics', getAllTopics)

app.get('/api', getApiDescriptions)

app.get('/api/articles/:id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:id/comments', getArticleComments)

app.get('/api/users', getAllUsers)


app.post('/api/articles/:id/comments', postArticleComment)

app.patch('/api/articles/:id', patchArticleVotes)

app.delete('/api/comments/:id', deleteComment)

app.all('*', (_, res) => {
    res.status(404).send({ status: 404, msg: 'NOT FOUND'})
})

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

module.exports = app