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

    //Sign Up user
    app.post("/api/auth/signup",
        [
            verifySignUp.checkDuplicateUser,
        ],
        controller.signup
    );
    
    //Sign In user
    app.post("/api/auth/signin", controller.signin);

    //Control route for session retrieval
    app.get("/api/auth",
        [authJwt.verifyToken],
        controller.ctrl
        );
};