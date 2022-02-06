const { authJwt, ownerOrAdmin } = require("../middleware");
const controller = require("../controllers/user.controller");
const upload = require('../middleware/multer');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, content-type, Accept"
        );
        next();
    });
    //To get one user
    app.get("/api/user/:name", 
        [authJwt.verifyToken],
        controller.getUserByName
    );
    //To get list of all users
    app.get("/api/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard

    );
    //Updates user info
    app.put("/api/user/:id",
        upload.single('image'),
        [authJwt.verifyToken, ownerOrAdmin],
        controller.updateUser
    );
    //Delete user
    app.delete("/api/user/:data",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.userDelete
    );
};