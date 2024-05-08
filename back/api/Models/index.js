const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('tradingsite', 'root', 'qqwwee112233', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./userModel')(sequelize, DataTypes);
db.items = require('./itemModel')(sequelize, DataTypes);
db.chats = require('./chatModel')(sequelize, DataTypes);
db.messages = require('./messageModel')(sequelize, DataTypes);
db.userChats = require('./userChatModel')(sequelize, DataTypes);
 // db.sequelize.sync({ force: false })
 //     .then(() => {
 //         console.log('Database synchronized');
 //     })
 //    .catch((err) => {
 //        console.error('Error synchronizing database:', err);
 //     });

module.exports = db;
