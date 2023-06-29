const db = require('./../connection')


exports.selectAllTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(({rows}) => {
        return rows;})
}

exports.selectArticleById = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({rows}) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: "NOT FOUND"})
            }
            return rows[0]
        })
    }