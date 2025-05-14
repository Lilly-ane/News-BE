const express = require("express");
const app = express();

const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById,getArticles, modifyVotesForArticle } = require("./controllers/articles.controller");
const {getUsers} =require("./controllers/users.controller")
const { getCommentsByArticleId, postCommentForArticle,removeComment} = require("./controllers/comments.controller");
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentForArticle)
app.patch("/api/articles/:article_id", modifyVotesForArticle)
app.delete("/api/comments/:comment_id", removeComment)
app.get("/api/users", getUsers)

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Invalid article_id" });
  }

  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }

  res.status(500).send({ msg: "Internal Server Error" });
});



module.exports = app;
