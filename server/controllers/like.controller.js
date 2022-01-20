const db = require("../models");
const Like = db.like;
const User = db.user;
/*Checks if user has reference to the like belonging to the article,
if it exist (user already liked this article) we remove it and decrease by one the value of the like.
Else we add the reference and increase the like value by one*/
exports.manageLikes = (req, res) => {
  const articleId = req.params.id;
  const userId = req.body.id;
  //Get the like associated with the article
  Like.findOne({
    where: { articleId: articleId }
  }).then(currentLike => {

    //Get instance of the user
    User.findByPk(userId)
    .then(user => {
      //Check if selected like has reference to user in user_likes table
      currentLike.hasUser(user).then(hasLiked => {
        if (!hasLiked) {
          //If not add reference 
          user.addLike(currentLike)
            .then(() => {

              const value = currentLike.value + 1;
              const likeId = currentLike.id;
              //Updates the value of the like
              Like.update(
                {value: value}, {
                where: {id: likeId}
              }).then(rows => {

                if (rows == 1) {
                  res.status(200).send({
                    message: "Article liked."
                  });
                } else {
                  res.status(500).send({
                    message: `Cannot update like value`
                  });
                };
              }).catch(err => {
                res.status(500).send({
                  message: err.message || "Error updating like (updating)"
                });
              });  
            }).catch(err => {
              res.status(500).send({
                message: err.message || "Error updating like (adding to user_likes)"
              });
            });
        }else {
          //if yes remove the reference
          user.removeLike(currentLike)
            .then(() => {

              const value = currentLike.value - 1;
              const likeId = currentLike.id;
              //update the like value
              Like.update(
                {value: value}, {
                where: {id: likeId}
              }).then(rows => {

                if (rows == 1) {
                  res.status(200).send({
                    message: "Article unliked."
                  });
                } else {
                  res.status(500).send({
                    message: `Cannot update like value`
                  });
                };
              }).catch(err => {
                res.status(500).send({
                  message: err.message || "Error updating like (updating)"
                });
              });  
            }).catch(err => {
              res.status(500).send({
                message: err.message || "Error updating like (removing to user_likes)"
              });
            });
        };
      }).catch(err => {
        res.status(500).send({ message: err.message });
      });
    }).catch(err => {
      res.status(500).send({ message: err.message || "Error finding associated user" });
    });
  }).catch(err => {
    res.status(500).send({ message: err.message || "Error finding associated like"});
  });     
};