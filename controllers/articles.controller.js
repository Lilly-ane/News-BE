const { selectArticleById, selectArticles} = require("../models/articles.model");

const db = require("../db/connection");

const getArticles = (req, res, next) => {
  selectArticles()
  .then((articles) => {
      console.log(articles)
      res.status(200).send({articles})
  }).catch(next)
}


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

module.exports = { getArticleById, getArticles};

