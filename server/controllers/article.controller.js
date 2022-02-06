const Sequelize  = require("sequelize");
const db = require("../models");
const Article = db.article;
const User = db.user;
const Like = db.like;
const Comment = db.comment;

//Article creation
exports.createArticle = (req, res) => {
  const userId = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  //If no data send error
  if (!title || !content) {
    res.status(400).send({message: "Content required"});
  };
  //Check if same title already exist
  Article.findOne({
      where: {title: title}
  }).then(article => {
    //If not complete data with author info
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
        //Save data in database
        Article.create({...article})
          .then(article => {
            //And create affiliated like 
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
      //Send error if title already exist
    } else {
      res.status(400).send({ message: "Title already in use"});
    };
  }).catch(err => {
    res.status(500).send({message: err.message});
  });
};
//Get list of all articles in database
exports.getAllArticles = (req, res) => {
    Article.findAll({
      //Include affiliated comments and like
        include: [
          {model: Like, attributes:["id", "value"]},
          {model: Comment, attributes: []}
        ],
        //Number of articles as custom attribute
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('comments.articleId')), 'commentCount']]
        },
        group: ['id']
    }).then(articleList => {
        //If no article present send a response message
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
//NOT IMPLEMENTED
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
//Get one article by his ID
exports.getArticleById = (req, res) => {

    const data = JSON.parse(req.params.data);
    const articleId = data.element;
    const userId = data.user;

    Article.findByPk(articleId, { include: [Like, Comment] })

        .then(article => {
            if (!article) {
                res.status(404).send({message: "No such article"});
            } else {
              //If article was found check if request user has liked article or not
              const currentLike = article.like
              User.findByPk(userId).then((user) => {

                currentLike.hasUser(user).then((isLiked) => {
                  //Add the like bool value to response (article info)
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
//Update article data
exports.updateArticle = (req, res) => {
    const reqId = req.params.id;
    const content = req.body.content;
    //If no request content send error
    if (!content) {
      res.status(400).send({message: "Content required"});
    };
    //Else save new data in database
    Article.update(
        {content: content}, {
        where: { id: reqId }
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Article was updated successfully."
          });
        } else {
          //Send error if no row modified
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
//Delete one article by ID
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
          //Send error if no row affected
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