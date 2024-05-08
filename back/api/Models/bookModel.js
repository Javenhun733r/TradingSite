// models/item.js

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("Book", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subcategory: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wishcategory: {
            type: DataTypes.JSON, // Use JSON datatype to store an array of photo paths
            allowNull: true
        },
        photos: {
            type: DataTypes.JSON, // Use JSON datatype to store an array of photo paths
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });


    return Book;
};
