const { selectArticleById, selectArticles,changeVotesForArticle} = require("../models/articles.model");
const endpoints =require("../endpoints.json")

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


const modifyVotesForArticle = (request, response, next) => {
    const { article_id } = request.params
    const { inc_votes: newVote } = request.body
    changeVotesForArticle(article_id, newVote).then((article) => {
        response.status(201).send({ article })
    })
}

module.exports = { getArticleById, getArticles, modifyVotesForArticle}

