
const { selectCommentsByArticleId} = require("../models/comments.model");
const endpoints =require("../endpoints.json")


const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params 

        return selectCommentsByArticleId(article_id).then((comment) => {
            response.status(200).send({ comment })
        })
}

module.exports = {getCommentsByArticleId}