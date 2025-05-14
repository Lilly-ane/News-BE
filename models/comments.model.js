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

  module.exports = {selectCommentsByArticleId}