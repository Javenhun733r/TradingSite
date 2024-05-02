const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('tradingsite', 'root', '1234', {
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
 // db.sequelize.sync({ force: false })
 //     .then(() => {
 //         console.log('Database synchronized');
 //     })
 //    .catch((err) => {
 //        console.error('Error synchronizing database:', err);
 //     });

module.exports = db;
