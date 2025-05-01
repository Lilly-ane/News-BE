const db = require("../db/connection");

const selectArticles = () => {
  return db.query(
      `SELECT 
    articles.article_id, 
    articles.title, 
    articles.topic, 
    articles.author, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.article_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC;`)
    .then((result) => {
      return result.rows;
    });
};

const selectArticleById = (articleId) => {
  if (isNaN(articleId)) {
    return Promise.reject({ status: 400, msg: "Invalid article_id" });
  }

  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { selectArticleById, selectArticles };
