const bcrypt = require("bcryptjs")
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                //isAlphanumeric: true,
                len: [3, 15]
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
                len: [6,18],
                is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/i

            },
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'http://localhost:8080/images/default_user.png',
            }
        },
        {
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                }
        }
    });
    return User;
};