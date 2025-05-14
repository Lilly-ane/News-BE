const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app.js");
const request = require("supertest");
const jestSorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array containing all available topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body).toHaveLength(3);
        expect(Array.isArray(body)).toBe(true);
        body.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with 1 article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Responds with not found when article does not exist", () => {
    return request(app)
      .get("/api/articles/90001724")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("400: responds with bad request when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article_id");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toHaveLength(13);
        response.body.articles.forEach((singleArticle) => {
          expect(singleArticle).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(singleArticle).not.toHaveProperty("body");
        });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comment.rows;

        comments.forEach((comment) => {
          expect(comment.length).not.toEqual(0);
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("comment_id");
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object showing newly inserted comment", () => {
    const postObj = {
      username: "icellusedkars",
      body: "This gif is awesome",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(postObj)
      .expect(201)
      .then((response) => {
        expect(response.body.newComment.article_id).toEqual(3);
        expect(response.body.newComment.body).toEqual("This gif is awesome");
        expect(response.body.newComment.author).toEqual("icellusedkars");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: Responds with an object showing updated article when we add votes to an article", () => {
    const postObj = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(postObj)
      .expect(201)
      .then((response) => {
        expect(response.body.article.article_id).toEqual(1);
        expect(response.body.article.title).toEqual(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toEqual("mitch");
        expect(response.body.article.author).toEqual("butter_bridge");
        expect(response.body.article.body).toEqual(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toEqual(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toEqual(105);
        expect(response.body.article.article_img_url).toEqual(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  }),
    test("201: Responds with an object showing updated article when we subtract votes from an article with more than 0 votes", () => {
      const postObj = {
        inc_votes: -5,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.article.article_id).toEqual(1);
          expect(response.body.article.title).toEqual(
            "Living in the shadow of a great man"
          );
          expect(response.body.article.topic).toEqual("mitch");
          expect(response.body.article.author).toEqual("butter_bridge");
          expect(response.body.article.body).toEqual(
            "I find this existence challenging"
          );
          expect(response.body.article.created_at).toEqual(
            "2020-07-09T20:11:00.000Z"
          );
          expect(response.body.article.votes).toEqual(95);
          expect(response.body.article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    }),
    test("201: Responds with an object showing updated article when we subtract votes from an article with 0 votes", () => {
      const postObj = {
        inc_votes: -5,
      };
      return request(app)
        .patch("/api/articles/4")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.article.article_id).toEqual(4);
          expect(response.body.article.title).toEqual("Student SUES Mitch!");
          expect(response.body.article.topic).toEqual("mitch");
          expect(response.body.article.author).toEqual("rogersop");
          expect(response.body.article.body).toEqual(
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
          );
          expect(response.body.article.created_at).toEqual(
            "2020-05-06T01:14:00.000Z"
          );
          expect(response.body.article.votes).toEqual(0);
          expect(response.body.article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    }),
    test("201: Responds with an object showing updated article when we add votes to an article with 0 votes", () => {
      const postObj = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/4")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.article.article_id).toEqual(4);
          expect(response.body.article.title).toEqual("Student SUES Mitch!");
          expect(response.body.article.topic).toEqual("mitch");
          expect(response.body.article.author).toEqual("rogersop");
          expect(response.body.article.body).toEqual(
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
          );
          expect(response.body.article.created_at).toEqual(
            "2020-05-06T01:14:00.000Z"
          );
          expect(response.body.article.votes).toEqual(5);
          expect(response.body.article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with nothing after deleting comment", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then((response) => {});
  });
});

describe("GET: /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: { users }}) => {
      expect(users).toHaveLength(4)
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
      });
    })
  })
})
})