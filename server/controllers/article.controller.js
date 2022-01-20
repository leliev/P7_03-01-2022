const db = require("../models");
const Article = db.article;
const User = db.user;
const Likes = db.like;
const Comments = db.comment;

exports.createArticle = (req, res) => {
  const userId = req.body.id;
  const title = req.body.title;

  Article.findOne({
      where: {title: title}
  }).then(article => {
    if (article === null || !article) {
      User.findOne({
        where: { id: userId}
      }).then(user => {
        const article = {
          title: title,
          content: req.body.content,
          author: user.username,
          userId: userId
        };
        Article.create({...article})
          .then(article => {
            Likes.create({articleId: article.id})
              .then(() => {
                  res.status(200).send({message: "Article created"});
              }).catch(err => {
                  res.status(500).send({
                    message: err.message || "Error creating associated like"
                  });
              });
          }).catch(err => {
            res.status(500).send({message: err.message || "Could not create article"});
          });
      }).catch(err => {
        res.status(404).send({message: err.message || "Error referencing current user"});
      });
    } else {
      res.send({ message: "Title already in use"});
    };
  }).catch(err => {
    res.status(500).send({message: err.message});
  });
};

exports.getAllArticles = (req, res) => {
    Article.findAll({
        include: [Likes, Comments],
        attributes: ["id", "title", "content", "author"]
    }).then(articleList => {
        if (articleList.length === 0 || !articleList) {
            res.status(200).send({ message: "No articles to display"} )
        } else {
            return res.status(200).send(articleList);
        };
    }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving articles."
        });
    });
};

exports.getUserArticles = (req, res) => {
    const userId = req.body.targetUserId;
    Article.findAll({
        where: { userId: userId },
        include: [Likes, Comments]
    }).then(articleList => {
        if (articleList.length === 0 || !articleList) {
            res.status(200).send({ message: "No articles to display"} )
        } else {
            res.status(200).send(articleList)
        };
    }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving articles."
        });
    });
};

exports.getArticleById = (req, res) => {
    const reqId = req.params.id;

    Article.findByPk(reqId, { include: [Likes, Comments] })
        .then(article => {
            if (!article) {
                res.status(404).send({message: "No such article"});
            } else {
                res.status(200).send(article);
            };
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the article."
            });
        });
};

exports.updateArticle = (req, res) => {
    const reqId = req.params.id;
    const content = req.body.content;

    Article.update(
        {content: content}, {
        where: { id: reqId }
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Article was updated successfully."
          });
        } else {
          res.status(500).send({
            message: `Cannot update article with id=${reqId}`
          });
        };
    }).catch(err => {
        res.status(500).send({
          message: err.message || "Error updating article"
        });
    });
};

exports.deleteArticle = (req, res) => {
    const reqId = req.params.id;

    Article.destroy({
        where: { id: reqId }
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Article was deleted successfully."
          });
        } else {
          res.status(500).send({
            message: `Cannot delete article with id=${reqId}`
          });
        };
    }).catch(err => {
        res.status(500).send({
          message: err.message || "Error deleting article"
        });
    });
};