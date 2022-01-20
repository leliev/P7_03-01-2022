const { authJwt } = require("../middleware");
const controller = require("../controllers/like.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, content-type, Accept"
        );
        next();
    });
    //Must be logged, option from unique article page or multiple article page
    //[id, token, (params.id)]
    app.put("/api/like/:id",
        [authJwt.verifyToken],
        controller.manageLikes
    );
};