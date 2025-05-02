const db= require("../db/connection")

selectComments = (article_id) => {
    return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
        .then((result) => {
            // console.log(result.rows);
            return result.rows
        })
  }

  module.exports = {selectComments}