const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;


verifyToken = (req, res, next) => {
    console.log(req.method)
    let token = req.header("x-access-token");

    if(!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    } else {
        jwt.verify(token, process.env.TKEY, (err, decoded) => {
            if(err) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            };
            switch (req.method) {
                case "GET":
                    
                case "DELETE":
                    req.userId = decoded.id;
                    next();
                    break;
        
                case "PUT":
        
                case "POST":
                    if (req.body.id && req.body.id !== decoded.id) {
                        throw 'Invalid user ID';
                    } else {
                        next();
                    };
                    break;
                default:
                    break;
            };
            /*if (req.method === ("GET" || "DELETE")) {
                req.userId = decoded.id;
                next();
            } else {
                if (req.body.id && req.body.id !== decoded.id) {
                    throw 'Invalid user ID';
                } else {
                    next();
                };
            };*/
        });
    }; 
};

isAdmin = (req, res, next) => {
    const userId = req.userId
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