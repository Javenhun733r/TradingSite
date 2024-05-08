module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subcategories:{
            type: DataTypes.JSON, // Use JSON datatype to store an array of photo paths
            allowNull: false
        }
    }, {
        timestamps: false
    });


    return Category;
};

