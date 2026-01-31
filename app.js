const express = require("express");
const cors = require("cors");

const endpoints = require("./endpoints.json");

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleById,
  modifyVotesForArticle,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentForArticle,
  removeComment,
} = require("./controllers/comments.controller");
const { getUsers, getUserByUsername } = require("./controllers/users.controller");

const app = express();

app.use(cors());
app.use(express.json());

// API endpoints description
app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", modifyVotesForArticle);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentForArticle);

app.delete("/api/comments/:comment_id", removeComment);

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

// 404
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
