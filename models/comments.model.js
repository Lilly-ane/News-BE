const db= require("../db/connection")

selectCommentsByArticleId= (article_id) => {
    return db
   .query(`select comment_id, article_id, body, votes, author,
       created_at from comments 
       where article_id = $1
       order by created_at desc; `, [article_id])
       .then(( result ) => {
         return result;
       })
}

const addCommentForArticle = (article_id, username, body) => {
   
   return db
   .query(`insert into comments (article_id, author, body)
      values
      ($1, $2, $3) returning *;`,
   [article_id, username, body]).then((result) => {
      return result.rows[0]
   })
}

 const deleteComment = (comment_id) => {
   return db
   .query(`delete from comments
      where comment_id = $1
      returning *;`, [comment_id])
}

  module.exports = {selectCommentsByArticleId, addCommentForArticle, deleteComment}