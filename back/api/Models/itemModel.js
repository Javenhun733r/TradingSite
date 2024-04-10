module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("item", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        photos: {
            type: DataTypes.STRING,
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