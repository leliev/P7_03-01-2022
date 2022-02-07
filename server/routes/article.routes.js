const { authJwt, ownerOrAdmin } = require("../middleware");
const controller = require("../controllers/article.controller");
const upload = require('../middleware/multer');


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, content-type, Accept"
        );
        next();
    });

    //Get list of all articles
    app.get("/api/article",
        [authJwt.verifyToken],
        controller.getAllArticles
    );

    //Get a list of user specific articles !!NOT IMPLEMENTED !!
    app.get("/api/article/user_article",
        [authJwt.verifyToken],
        controller.getUserArticles
    );

    //Get article by ID
    app.get("/api/article/:data",
        [authJwt.verifyToken],
        controller.getArticleById
    );

    //Post article
    app.post("/api/article",
        [authJwt.verifyToken],
        controller.createArticle
    );

    //Update article route
    app.put("/api/article/:id",
        upload.single('image'),
        [authJwt.verifyToken, ownerOrAdmin],
        controller.updateArticle
    );

    //Delete article route
    app.delete("/api/article/:data",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.deleteArticle
    );
};