const { authJwt, ownerOrAdmin } = require("../middleware");
const controller = require("../controllers/article.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, content-type, Accept"
        );
        next();
    });

    //Must be logged, result of article page
    //[id, token]
    app.get("/api/article",
        [authJwt.verifyToken],
        controller.getAllArticles
    );

    //Must be logged, option from user profile page
    //[id, token, targetUserId]
    app.get("/api/article/user_article",
        [authJwt.verifyToken],
        controller.getUserArticles
    );

    //Must be logged, onclick on article
    //[id, token, (params.id)]
    app.get("/api/article/:id",
        [authJwt.verifyToken],
        controller.getArticleById
    );

    //Must be logged, option from article page
    //[id, token, title, content]
    app.post("/api/article",
        [authJwt.verifyToken],
        controller.createArticle
    );

    //Must be logged and owner or admin, option from unique article page
    //[id, token, content]
    app.put("/api/article/:id",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.updateArticle
    );

    //Must be logged and owner or admin, option from unique article page
    //[id, token]
    app.delete("/api/article/:id",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.deleteArticle
    );
};