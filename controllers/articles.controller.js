const { selectArticleById } = require("../models/articles.model");

const db = require("../db/connection");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return next({ status: 404, msg: "Article not found" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { getArticleById };

