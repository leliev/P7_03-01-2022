const db = require("../models");
const User = db.user;


exports.allAccess = (req, res) => {
    res.status(200).send("Public content");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User content");
};

//Get list of all users
exports.adminBoard = (req, res) => {
    User.findAll().then(userList => {
      if (userList.length === 0 || !userList) {
        res.status(500).send({message: "cannot be right"})
      } else {
        res.status(200).send(userList)
      };
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.userUpdate = (req, res) => {
  //to add
};


exports.getUserByName = (req, res) => {
    const username = req.params.name;

    User.findOne({
        where: {username: username}
    }).then(user => {
        if (user === null) {
            return res.status(404).send({message: "User not found!"});
        } else {
            user.countArticles().then(totalArticle => {
                user.countComments().then(totalComment => {
                    const userData = {
                        targetId: user.id,
                        username: user.username,
                        email: user.email,
                        Article: totalArticle,
                        Comment: totalComment
                    }
                    return res.status(200).send(userData);
                }).catch(() => {
                    res.status(500).send({message: "Error fetching target user comment count"});
                });
            }).catch(() => {
                res.status(500).send({message: "Error fetching target user article count"});
            });
        };
    }).catch(() => {
        res.status(500).send({message: "Error fetching target user"});
    });
};

exports.userDelete = (req, res) => {
    const userId = req.body.targetUserId;
    
    User.findByPk(userId).then(user => {
        if (user === null) {
            return res.status(404).send({message: "User not found!"});
        }

        User.destroy({
            where: { id: userId }
          })
          .then(rows => {
            if (rows == 1) {
                return res.status(200).send({
                    message: "User was deleted successfully!"
              });
            } else {
                return res.status(500).send({
                    message: `Cannot delete user. Maybe user was not found!`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete user"
            });
          });
    });
};