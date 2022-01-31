const { authJwt, ownerOrAdmin } = require("../middleware");
const controller = require("../controllers/comment.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, content-type, Accept"
        );
        next();
    });
    //Must be logged, option from unique article page
    //[id, token, content, (params.id)]
    app.post("/api/comment/:id",
        [authJwt.verifyToken],
        controller.createComment
    );
    //Must be logged, onclick from unique article page
    //[id, token, (params.id)]
    app.get("/api/comment/:id",
        [authJwt.verifyToken],
        controller.getCommentById
    );
    //Must be logged and owner or admin, option from unique comment page
    //[id, token, content, (params.id)]
    app.put("/api/comment/:id",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.updateComment
    );
    //Must be logged and owner or admin, option from unique comment page
    //[id, token, (params.id)]
    app.delete("/api/comment/:data",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.deleteComment
    );
};