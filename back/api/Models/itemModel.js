// models/item.js

module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("Item", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
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
        timestamps: false
    });

    Item.associate = (models) => {
        Item.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Item;
};
