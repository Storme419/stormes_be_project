const {selectAllTopics} = require('./../models/models')



exports.getAllTopics = (req, res) => {
    selectAllTopics()
    .then((topics) => {res.status(200).send({topics})})
}