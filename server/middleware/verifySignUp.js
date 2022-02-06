const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

//Verify user unicity, unique username and email
checkDuplicateUser = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).json({
                message: "Failed! User already exist!(name)"
            });
            return;
        }
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).json({
                    message: "Failed! User already exist!(email)"
                });
                return;
            }
            next();
        }).catch(err => {
            res.status(500).json({error: err.message});
        });  
    }).catch(err => {
        res.status(500).json({error: err.message});
    });
};

const verifySignUp = {
    checkDuplicateUser: checkDuplicateUser,
};

module.exports = verifySignUp;