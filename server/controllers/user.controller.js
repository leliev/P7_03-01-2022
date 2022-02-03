const fs = require("fs");
const Sequelize  = require("sequelize");
const db = require("../models");
const User = db.user;
const Comment = db.comment;
const Article = db.article;

var bcrypt = require("bcryptjs");

//Get list of all users
exports.adminBoard = (req, res) => {
  User.findAll({
    include: [
      {model: Article, attributes:[]},
      {model: Comment, attributes:[]}
    ],
    //Include custom attributes to each user found
    attributes: {
      include: [
        //Number of user comments
        [Sequelize.fn('COUNT', Sequelize.col('comments.userId')), 'commentCount'],
        //Number of user articles
        [Sequelize.fn('COUNT', Sequelize.col('articles.userId')), 'articleCount']    
      ]},
      //Important we group them by user id!!
      group: ['id']
            
    }).then(userList => {
      //If no user something is wrong 
      //at least the user who sent the request should be found
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

//Updates user with user input
exports.updateUser = async (req, res) => {
  
  try {
    const userId = parseInt(req.params.id);
    const defaultUrl = 'http://localhost:8080/images/default_user.png';
    let image;
    let userObject = {};
    const user = await User.findByPk(userId);

    //Image update "route"
    if (req.file) {
      //Remove old profile image if not default.
      //Multer set filename with a time stamp,
      //filename are unique even if uploaded file are the same.
      if (user.imageUrl !== defaultUrl) {
        const filename = user.imageUrl.split('/images/')[1];
        console.log("old filename:"+filename)
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
          console.log("deleted old image");
        });
      };
      //New profile image URL
      image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      User.update({ imageUrl: image }, { where: { id: userId } }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "User was updated successfully."
          });
        } else {
          res.status(500).send({
            message: `Cannot update user with id=${id}(image)`
          });
        };
      //May be not needed (try/catch)
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Error updating user image"
        });
      });
    };
    if (req.body.email)
    userObject = {
      ...userObject,
      email: req.body.email
    };
    if (req.body.password) {
      var passwordIsValid = bcrypt.compareSync(req.body.old_password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({
            accessToken: null,
            message: "Invalid Password!"
        });
      };
      userObject = {
        ...userObject,
        password: bcrypt.hashSync(req.body.password, 10)
      };
    };
    if (Object.keys(userObject).length !== 0) {
      console.log("new user data:" + JSON.stringify(userObject))
      User.update({ ...userObject }, { where: { id: userId } }).then(rows => {
        if (rows == 1) {
          res.status(200).send({
            message: "User was updated successfully."
          });
        } else {
          res.status(500).send({
            message: `Cannot update user with id=${id}(data)`
          });
        };
      //May be not needed (try/catch)
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Error updating user data"
        });
      });
    };
    //Update user
    
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating user image"
    });
  };
};

//Get one user by name(set unique)
exports.getUserByName = (req, res) => {
  const username = req.params.name;

  User.findOne({where: {username: username}}).then(user => {
    //If no user found
    if (user === null) {
      return res.status(404).send({message: "User not found!"});
    } else {
      //Add number of user articles
      user.countArticles().then(totalArticle => {
        //And number of user comments
        user.countComments().then(totalComment => {
          const userData = {
            targetId: user.id,
            username: user.username,
            email: user.email,
            imageUrl: user.imageUrl,
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

//Delete user profile but not user articles or comments
exports.userDelete = (req, res) => {
  const data = JSON.parse(req.params.data);
  const targetId = data.element;
  console.log(targetId)
    
  User.findByPk(targetId).then(user => {
    //If no user corresponding found 
    if (user === null) {
      return res.status(404).send({message: "User not found!"});
    };

    User.destroy({where: { id: targetId }}).then(rows => {
      if (rows == 1) {
        return res.status(200).send({
          message: "User was deleted successfully!"
        });
      } else {
        //If no rows were affected
        return res.status(500).send({
          message: `Cannot delete user. Maybe user was not found!`
        });
      };
    //Could not destroy (syntax ?)
    }).catch(err => {
      res.status(500).send({message:  "Could not delete user"});
    });
  //Could not find user (syntax ?)
  }).catch(err => {
    res.status(500).send({message: err.message || "Could not find user to delete"});
  });
};