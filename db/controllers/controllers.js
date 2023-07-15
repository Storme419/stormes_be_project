const {
    selectAllTopics, 
    selectArticleById, 
    selectAllArticles,
    selectArticleWithComments,
    insertComment,
    updateArticleVotes,
    removeComment
} = require('./../models/models')
const endpoints = require("./../../endpoints.json")


exports.getAllTopics = (req, res) => {
    selectAllTopics()
    .then((topics) => {res.status(200).send({topics})})
}

exports.getApiDescriptions = (req, res) => {
    res.status(200).send({endpoints})
}

exports.getArticleById = (req, res, next) => {
    const {id} = req.params
    selectArticleById(id)
    .then((article) => {
       res.status(200).send({article})
    })
    .catch(next)
}

exports.getAllArticles = (req, res) => {
    selectAllArticles()
    .then((articles) => {res.status(200).send({articles})})
}

exports.getArticleComments = (req, res, next) => {
    const {id} = req.params  
    selectArticleWithComments(id)
    .then((comment) => {
        res.status(200).send({comment})
    })
    .catch(next)
}

exports.postArticleComment = (req, res, next) => {
    const {id} = req.params
    const {username, body} = req.body

    selectArticleById(id)
    
    .then(article => {
        if(!article) {
            throw{status: 404, msg: 'Not Found'}
        } else {
            return insertComment(id, username, body)
        }
    })
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

exports.patchArticleVotes = (req, res, next) => {
    const {id} = req.params
    const {inc_votes} = req.body

    updateArticleVotes(inc_votes, id)
    
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const {id} = req.params

    removeComment(id)

    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}