const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, content-type, Accept"
        );
        next();
    });

    //[username, email, password]
    app.post("/api/auth/signup",
        [
            verifySignUp.checkDuplicateUser,
        ],
        controller.signup
    );
    
    //[username, password]
    app.post("/api/auth/signin", controller.signin);

    //[id, token]
    app.post("/api/auth",
        [authJwt.verifyToken],
        controller.ctrl
        );
};