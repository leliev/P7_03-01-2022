module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("likes", {
        value: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });

    return Like;
}