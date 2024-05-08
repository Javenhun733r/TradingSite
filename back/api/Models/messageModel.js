module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true // Додати timestamps для автоматичного створення поля createdAt
    });

    return Message;
};