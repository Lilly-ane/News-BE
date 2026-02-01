const {
  selectCommentsByArticleId,
  addCommentForArticle,
  deleteComment,
} = require("../models/comments.model");

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments }); // <- plural
    })
    .catch(next);
};

const postCommentForArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  addCommentForArticle(article_id, username, body)
  .then((newComment) => {
    res.status(201).send({ newComment });
  })
  .catch(next);

};

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { getCommentsByArticleId, postCommentForArticle, removeComment };
