const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const ownerOrAdmin = require("./ownerOrAdmin");

module.exports = {
    authJwt,
    verifySignUp,
    ownerOrAdmin
};