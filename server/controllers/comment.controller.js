const db = require("../models");
const Comment = db.comment;
const User = db.user;

exports.createComment = (req, res) => {
    const userId = req.body.id ;
    
    User.findOne({
        where: { id: userId }
    }).then(user => {
        const comment = {
            content: req.body.content,
            author: user.username,
            userId: userId,
            articleId: req.params.id
        };
        Comment.create({...comment})
            .then(comment => {
                res.status(200).send({message: "Comment created"});
            }).catch(err => {
                res.status(500).send({message: err.message || "Could not create comment"});
            });
    }).catch(err => {
        res.status(500).send({message: err.message || "Error referencing current user"})
    });
};

exports.getCommentById = (req, res) => {
    const reqId = req.params.id;

    Comment.findByPk(reqId)
        .then(comment => {
          if (!comment) {
            res.status(404).send({message: "No such comment"});
          } else {
            res.status(200).send(comment);
          };
        }).catch(err => {
            res.status(500).send({
                message: err.message || `Cannot find comment with id=${reqId}`
            });
        });
};

exports.updateComment = (req, res) => {
    const reqId = req.params.id;
    const content = req.body.content;

    Comment.update(
        {content: content}, {
        where: {id: reqId}
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Comment was updated successfully."
          });
        } else {
          res.status(500).send({
            message: `Cannot update comment with id=${reqId}`
          });
        };
    }).catch(err => {
        res.status(500).send({
          message: err.message || "Error updating comment"
        });
    });
}

exports.deleteComment = (req, res) => {
    const reqId = req.params.id;

    Comment.destroy({
        where: {id: reqId}
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Comment was deleted successfully."
          });
        } else {
          res.status(500).send({
            message: `Cannot delete comment with id=${reqId}`
          });
        };
    }).catch(err => {
        res.status(500).send({
          message: err.message || "Error deleting comment"
        });
    });
};