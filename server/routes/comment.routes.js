const { authJwt, ownerOrAdmin } = require("../middleware");
const controller = require("../controllers/comment.controller");
const upload = require('../middleware/multer');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, content-type, Accept"
        );
        next();
    });
    //Post a comment
    app.post("/api/comment/:id",
        [authJwt.verifyToken],
        controller.createComment
    );
    //Get a comment !! NOT IMPLEMENTED !!
    app.get("/api/comment/:id",
        [authJwt.verifyToken],
        controller.getCommentById
    );
    //Update a comment
    app.put("/api/comment/:id",
        upload.single('image'),
        [authJwt.verifyToken, ownerOrAdmin],
        controller.updateComment
    );
    //Delete comment
    app.delete("/api/comment/:data",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.deleteComment
    );
};