const { selectComments } = require("../models/comments.model");

getComments = (req, res, next) => {
    const article_id = req.params.article_id
        if (isNaN(article_id)) {
        return res.status(400).send({msg: "Bad request - article_id must be a number"});
    }
    fetchArticleId(article_id)
    .then((article) => {
        if (!article) {
            return res.status(404).send({ msg: "Article not found"});
        }
        return selectComments(article_id)

    })
    .then((comments) => {
        if (comments.length === 0) {
           return res.status(200).send({comments: [], msg: "No comments found for this article"})
        }
        res.status(200).send({ comments })
    })
    .catch(next)
}

module.exports = { getComments }