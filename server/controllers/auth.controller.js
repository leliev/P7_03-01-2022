const db = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/;

//Signup route
exports.signup = (req, res) => {
    console.log(req.body)
    const { username, email, password } = req.body;
    if (username == null || email == null || password == null) {
        return res.status(400).json({ message: 'Missing parameters' });
    };
    if (!regex.test(password)) {
        return res.status(400).json({
            message:
              'Password must be 6 - 18 characters long, at least one uppercase, one lowercase and one digit',
          });
    }
    //Save into database
    User.create({ ...user })
      .then(user => {
        user.setRoles([1]).then(() => {
            res.status(200).json({message: "User registered successfully!"})
        });
      }).catch(err => {
          res.status(500).json({message: err.message});
      });  
};
//Sigin route
exports.signin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).json({message: "User not found!"});
        };
        //Check password validity
        var passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!"
            });
        };
        //Sign token for user credentials 
        var token = jwt.sign({ id: user.id}, process.env.TKEY, {
            expiresIn: 86400 //24H ...too long
        });
        res.status(200).json({accessToken: token });//id: user.id,
                
    }).catch(err => {
        res.status(500).json({message: err.message});
    });
};

//Control route for storing user credentials in state (front)
exports.ctrl = (req, res) => {
    const userId = req.userId;
    User.findByPk(userId).then((user) => {
        if (user === null) {
            return res.status(404).json({message: "User not found!"});
        } else {
            //Check user privileges
            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                const userData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    imageUrl: user.imageUrl,
                };
                //Send user data
                res.status(200).json(userData);
            }).catch(err => {
                res.status(500).json({error: err.message});
            });
        }
    }).catch(err => {
        res.status(500).json({error: err.message});
    });
}