const db = require("../models");
const User = db.user;
const Article = db.article;

module.exports = (req, res, next) => {
  let userId = 0;
  let elementId = 0;
  console.log("method OwnerOrAdmin:"+req.method )
  
  //Evaluates the request method for corresponding variables setting
  switch (req.method) {
    //GET and DELETE with no request data 
    case "GET":
      
    case "DELETE":
      console.log("get/delete route OwnerOrAdmin")
      const data = JSON.parse(req.params.data);
      userId = parseInt(data.user);
      elementId = parseInt(data.element);
      break;
    //PUT and POST with request data
    case "PUT":

    case "POST":
      console.log("put/post route OwnerOrAdmin")
      userId = parseInt(req.body.id);
      elementId = parseInt(req.params.id);
      break;
      
    default:
      break;
  };
  
  //Get the target element to handle via URL path
  const url = new URL(req.url, process.env.URL_SERVER);
  const path = url.pathname.split("/"); 
  const element = path[2];
  
  //Check for request creator privileges
  User.findByPk(userId).then(user => {
    if (user === null) {
      return res.status(404).send({message: "User not found (OwnerOrAdmin)!"});
    };
    user.hasRole(2).then(result => {
      if (result) {
        console.log("you are admin")
        next();
        return;
      };
      //If no privileges were found check for ownership
      //Evaluates the request target for corresponding actions
      switch (element) {
        //Articles
        case "article":
          user.hasArticle(elementId).then(r => {
            if (r) {
              console.log("you are owner")
              next();
              return;
            } else {
              res.status(403).send({
                message: "Require ownership or Admin Role!"
              });
            };
          }).catch(()=> {
            res.status(500).send({message: "Error checking relations user/article"});
          });
          break;
        //Comments
        case "comment":
          user.hasComment(elementId).then(r => {
            if (r) {
              console.log("you are owner")
              next();
              return
            } else {
              res.status(403).send({message: "Require ownership or Admin Role!"});
            };
          }).catch(()=> {
            res.status(500).send({message: "Error checking relations user/comment"});
          });
          break;
        //Users 
        case "user":
          if (user.id === elementId) {
            next();
            return;
          } else {
            res.status(403).send({message: "Require ownership or Admin Role!"});
          };         
          break;
        //Default action for unknown element
        default:
          res.status(500).send({message: "something went wrong"})
          break;
        };
    }).catch((err)=> {
      res.status(500).send({message: err.message || "Error checking relations user/role"});
    });
  }).catch(err => {
    res.status(500).send({message: err.message ||"Error fetching user by Pk"})
  });
};