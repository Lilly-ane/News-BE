
const { selectCommentsByArticleId, addCommentForArticle} = require("../models/comments.model");
const endpoints =require("../endpoints.json")


const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params 

        return selectCommentsByArticleId(article_id).then((comment) => {
            response.status(200).send({ comment })
        })
}

 const postCommentForArticle = (request, response, next) => {
    const { article_id } = request.params
    const{ username, body } = request.body
    addCommentForArticle(article_id, username, body).then((newComment) => {
        response.status(201).send({ newComment })
    })
}



module.exports = {getCommentsByArticleId, postCommentForArticle}