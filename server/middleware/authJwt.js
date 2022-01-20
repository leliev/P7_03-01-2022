const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, process.env.TKEY, (err, decoded) => {
        if(err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        };
        if (req.body.id && req.body.id !== decoded.id) {
            throw 'Invalid user ID';
        } else {
            next();
        };
    });
};

isAdmin = (req, res, next) => {
    const userId = req.body.id
    User.findByPk(userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};
module.exports = authJwt;