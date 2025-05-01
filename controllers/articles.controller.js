const db = require("../db/connection");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      const article = result.rows[0];

      if (!article) {
        return next({ status: 404, msg: "Article not found" });
      }

      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById };
