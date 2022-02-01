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

    /*Must be logged, profile page
    //[id, token]
    app.get("/api/user",
        [authJwt.verifyToken],
        controller.userBoard
    );*/
    
    //Must be logged
    //[id, token, (params.name)]
    app.get("/api/user/:name", 
        [authJwt.verifyToken],
        controller.getUserByName
    );

    //Must be logged and admin, admin page get all users
    //[id, token]
    app.get("/api/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard

    );

    app.put("/api/user/:id",
        
        //authJwt.verifyToken, ownerOrAdmin,
        upload.single('image'),
        [authJwt.verifyToken],
        controller.updateUser
    );
    
    //Must be logged and owner or admin, option from profile page
    //[id, token]
    app.delete("/api/user/delete",
        [authJwt.verifyToken, ownerOrAdmin],
        controller.userDelete
    );
};