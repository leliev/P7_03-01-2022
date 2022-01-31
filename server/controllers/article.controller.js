const Sequelize  = require("sequelize");
const db = require("../models");
const Article = db.article;
const User = db.user;
const Like = db.like;
const Comment = db.comment;

exports.createArticle = (req, res) => {
  const userId = req.body.id;
  const title = req.body.title;
  const content = req.body.content;

  if (!title || !content) {
    res.status(400).send({message: "Content required"});
  };

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
            Like.create({articleId: article.id})
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
      res.status(400).send({ message: "Title already in use"});
    };
  }).catch(err => {
    res.status(500).send({message: err.message});
  });
};

exports.getAllArticles = (req, res) => {
    Article.findAll({
        include: [
          {model: Like, attributes:["id", "value"]},
          {model: Comment, attributes: []}
        ],
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('comments.articleId')), 'commentCount']]
        },
        group: ['id']
    }).then(articleList => {
        if (articleList.length === 0 || !articleList) {
            res.status(200).send({ message: "No articles to display"} )
        } else {
            return res.status(200).json(articleList);
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
      attributes: {
        include: [[Sequelize.fn('COUNT', Sequelize.col('comments.articleId')), 'commentCount']]
        },
      include: [{model:Like, attributes: ["id", "value"]},
        {model: Comment, attributes: []}],
      group: ['comments.articleId']
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

    const data = JSON.parse(req.params.data);
    const articleId = data.element;
    const userId = data.user;

    Article.findByPk(articleId, { include: [Like, Comment] })

        .then(article => {
            if (!article) {

                res.status(404).send({message: "No such article"});
            } else {

              const currentLike = article.like
              User.findByPk(userId).then((user) => {

                currentLike.hasUser(user).then((isLiked) => {

                  const payload = {article, isLiked}
                  res.status(200).json(payload);

                }).catch(() => {
                    res.status(404).send({message: "Error relation user/like"});
                });
              }).catch(() => {
                res.status(404).send({message: "Can't find request user"});
              });
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

    if (!content) {
      res.status(400).send({message: "Content required"});
    };

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
    const data = JSON.parse(req.params.data);
    const articleId = data.element;

    Article.destroy({
        where: { id: articleId }
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Article was deleted successfully."
          });
        } else {
          res.status(500).send({
            message: `Cannot delete article with id=${articleId}`
          });
        };
    }).catch(err => {
        res.status(500).send({
          message: err.message || "Error deleting article"
        });
    });
};