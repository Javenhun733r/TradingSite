const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require('./api/Models')
const userRoutes = require ('./api/Routes/userRoutes')
const cors = require("cors");
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const chatController = require('./api/Controllers/chatController')
const app = express()

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors());
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("db has been re sync")
// })

app.use('/', userRoutes)
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'], // Дозволяємо запити з цих доменів
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('updateChatHistory', async (chatId) => {
        try {
            const messages = await db.messages.findAll({ where: { chatId } });
            const enrichedMessages = await Promise.all(messages.map(chatController.enrichMessage));
            io.emit('chatHistoryUpdated', enrichedMessages);
        } catch (error) {
            console.error('Error updating chat history:', error);
        }
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});