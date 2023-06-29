const {
    selectAllTopics, 
    selectArticleById
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
        if(article) {
            res.status(200).send({article})
        } else {
            res.status(404).send({msg: 'NOT FOUND'})
        }       
    })
    .catch(next)
}