const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

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

/*checkRoleExist = (req, res, next) => {
    if(req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).json({
                    error: "Failed! Role does not exist = " + req.body.roles[i]
                });
            }
        }
    }
    next();
};*/

const verifySignUp = {
    checkDuplicateUser: checkDuplicateUser,
    //checkRoleExist: checkRoleExist
};

module.exports = verifySignUp;