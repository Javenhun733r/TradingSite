module.exports = (sequelize, DataTypes) => {
    const UserChat = sequelize.define('UserChat', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return UserChat;
};
