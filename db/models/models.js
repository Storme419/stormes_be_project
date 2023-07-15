const db = require('./../connection')


exports.selectAllTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(({rows}) => {
        return rows;
    })
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

exports.selectAllArticles = () => {
    return db.query(
        `SELECT 
            articles.author, 
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url, 
                COUNT(comments.article_id) AS comment_count
        FROM 
            articles 
        LEFT JOIN
            comments ON articles.article_id = comments.article_id
        GROUP BY 
            articles.article_id
        ORDER BY
            created_at DESC`)
    .then(({rows}) => {
        return rows;
    })
}

exports.selectArticleWithComments = (id) => {
    return db
        .query(`
        SELECT 
            * 
        FROM 
            comments 
        WHERE 
            article_id = $1
        ORDER BY 
            created_at DESC`, [id])
        .then(({rows}) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: "NOT FOUND" })
            }
            return rows
        })
}   

exports.insertComment = (id, username, body) => {
    return db
        .query('INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
        [id, username, body])
        .then(({rows}) => {
            return rows[0]
        })
        .catch((error) => {
            throw error;
        })
}

exports.updateArticleVotes = (inc_votes, id) => {
    return db
    .query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
    [inc_votes, id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "NOT FOUND" })
        }
        return rows[0]
    })
}

exports.removeComment = (id) => {
    return db
    .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [id])
    .then(({rows}) => {
        if(rows.length === 0) {
        return Promise.reject({ status: 404, msg: "NOT FOUND" })
        }
    })
}