// models/chat.js

module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });


    return Chat;
};

