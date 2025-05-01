const db = require("../db/connection");


const selectArticleById = (articleId) => {
  if (isNaN(articleId)) {
    return Promise.reject({ status: 400, msg: "Invalid article_id" });
  }

  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then((result) => {
      return result.rows[0]; // fie articolul, fie undefined
    });
};

module.exports = { selectArticleById };



