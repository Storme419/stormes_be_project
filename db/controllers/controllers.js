const {selectAllTopics} = require('./../models/models')
const endpoints = require('./../../endpoints.json')


exports.getAllTopics = (req, res) => {
    selectAllTopics()
    .then((topics) => {res.status(200).send({topics})})
}

exports.getApiDescriptions = (req, res) => {
    console.log({endpoints})
    res.status(200).send({endpoints})
}