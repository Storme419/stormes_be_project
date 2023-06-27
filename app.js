const express = require('express')
const {getAllTopics} = require('./db/controllers/controllers')
const app = express()


app.get('/api/topics', getAllTopics)



app.all('*', (_, res) => {
    res.status(404).send({ status: 404, msg: 'NOT FOUND'})
})

module.exports = app