const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.article = require("../models/article.model")(sequelize, Sequelize);
db.comment = require("../models/comment.model")(sequelize, Sequelize);
db.like = require("../models/like.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.ROLES = ["user", "admin"];

db.user.hasMany(db.article);
db.article.belongsTo(db.user, {
  foreignKey: {
    allowNull: false
  }
});
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user, {
  foreignKey: {
    allowNull: false
  }
});
db.user.belongsToMany(db.like, {
  through: "user_likes",
  foreignKey: "userId",
  otherKey: "likeId"
});
db.like.belongsToMany(db.user, {
  through: "user_likes",
  foreignKey: "likeId",
  otherKey: "userId"
});
db.article.hasMany(db.comment, { 
  onDelete: "CASCADE"
 });
db.comment.belongsTo(db.article, {
  foreignKey: {
    allowNull: false
  }
});

db.article.hasOne(db.like, {
  onDelete: "CASCADE"
});
db.like.belongsTo(db.article, {
  foreignKey: {
    allowNull: false
  }
});

module.exports = db;