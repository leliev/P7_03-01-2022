module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define("articles", {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            alowNull: false
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Article;
}