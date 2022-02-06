const db = require("../models");
const Comment = db.comment;
const User = db.user;

//Comment creation
exports.createComment = (req, res) => {
    const userId = req.body.id ;
    const articleId = parseInt(req.params.id)
    const content = req.body.content;

    //If no content send error
    if (!content) {
      res.status(400).send({message: "Content required"});
    };
    //Create the comment object with affiliated user id and article id
    User.findOne({
        where: { id: userId }
    }).then(user => {
        const comment = {
            content: content,
            author: user.username,
            userId: userId,
            articleId: articleId
        };
        //Save data in database
        Comment.create({...comment})
            .then(() => {
                res.status(200).send({message: "Comment created"});
            }).catch(err => {
                res.status(500).send({message: err.message || "Could not create comment"});
            });
    }).catch(err => {
        res.status(500).send({message: err.message || "Error referencing current user"})
    });
};
//NOT IMPLEMENTED
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
//Updates comment data
exports.updateComment = (req, res) => {
    const reqId = req.params.id;
    const content = req.body.content;
    //If no content send error
    if (!content) {
      res.status(400).send({message: "Content required"});
    };
    //Update comment
    Comment.update(
        {content: content}, {
        where: {id: reqId}
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Comment was updated successfully."
          });
        } else {
          //If no raw affected send error
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
//Delete comment route
exports.deleteComment = (req, res) => {
  const data = JSON.parse(req.params.data);
  const commentId = data.element;
  

    Comment.destroy({
        where: {id: commentId}
    }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "Comment was deleted successfully."
          });
        } else {
          //If no raw affected send error
          res.status(500).send({
            message: `Cannot delete comment with id=${commentId}`
          });
        };
    }).catch(err => {
        res.status(500).send({
          message: err.message || "Error deleting comment"
        });
    });
};