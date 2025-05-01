const db = require("../connection");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics;`))

    // CREATE TABLES
    .then(() => {
      return db.query(`
        CREATE TABLE topics (
          slug VARCHAR(40) PRIMARY KEY,
          description VARCHAR(100),
          img_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(30) PRIMARY KEY,
          name VARCHAR(80),
          avatar_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(100),
          topic VARCHAR(40) REFERENCES topics(slug),
          author VARCHAR(30) REFERENCES users(username),
          body TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id),
          body TEXT,
          votes INT DEFAULT 0,
          author VARCHAR(30) REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    })

    // INSERT TOPICS
    .then(() => {
      const formattedTopics = topicData.map(({ slug, description, img_url }) => [
        slug,
        description,
        img_url,
      ]);
      const insertTopicsQuery = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
        formattedTopics
      );
      return db.query(insertTopicsQuery);
    })

    // INSERT USERS
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => [
        username,
        name,
        avatar_url,
      ]);
      const insertUsersQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })

    // INSERT ARTICLES
    .then(() => {
      const formattedArticles = articleData.map(
        ({ title, topic, author, body, created_at, votes, article_img_url }) => [
          title,
          topic,
          author,
          body,
          new Date(created_at),
          votes,
          article_img_url,
        ]
      );
      const insertArticlesQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticles
      );
      return db.query(insertArticlesQuery);
    })

    // INSERT COMMENTS
    .then(() => {
      const formattedComments = commentData.map(
        ({ article_id, body, votes, author, created_at }) => [
          article_id,
          body,
          votes,
          author,
          new Date(created_at),
        ]
      );
      const insertCommentsQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
        formattedComments
      );
      return db.query(insertCommentsQuery);
    });
};

module.exports = seed;
 