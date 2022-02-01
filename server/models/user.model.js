module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true,
                len: [2, 10]
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                min: 8
            }
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'http://localhost:8080/images/default_user.png',
            }
    });
    return User;
};