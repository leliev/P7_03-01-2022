const db = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    
    User.create({ ...user })
      .then(user => {
        user.setRoles([1]).then(() => {
            res.send({message: "User registered successfully!"})
        });
      }).catch(err => {
          res.status(500).send({message: err.message});
      });  
};

exports.signin = (req, res) => {
    const username = req.body.username;
    User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({message: "User not found!"});
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = jwt.sign({ id: user.id}, process.env.TKEY, {
            expiresIn: 86400 //24H
        });

        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
};