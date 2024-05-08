const db = require('../Models');
const jwt = require("jsonwebtoken");
const Chat = db.chats;
const Message = db.messages;
const User = db.users;
const UserChat = db.userChats;

const createChat = async (req, res) => {
    try {
        const { name, userIds } = req.body;

        const chat = await Chat.create({ name });
        const chatId = chat.id;
        const decoded = jwt.verify(userIds[0], process.env.secretKey);
        userIds[0] = decoded.id;
        console.log(userIds);
        const userChatPromises = userIds.map(async (userId) => {
            await UserChat.create({ userId, chatId });
        });
        // Wait for all UserChat creations to complete
        await Promise.all(userChatPromises);

        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserChats = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.secretKey);

        const userId = decoded.id;

        // Find all UserChat entries associated with the userId
        const userChats = await UserChat.findAll({
            where: { userId },
        });

        // Extract chatIds from userChats
        const chatIds = userChats.map(userChat => userChat.chatId);

        // Find all Chat records where id is in chatIds
        const chats = await Chat.findAll({
            where: { id: chatIds }
        });

        res.json(chats);
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { text } = req.body;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.secretKey);

        const userId = decoded.id;
        const message = await Message.create({ chatId, userId, text });

        // Після створення повідомлення, повертаємо створене повідомлення разом з інформацією про користувача
        const user = await User.findByPk(userId); // Знайти користувача за ідентифікатором
        const messageWithUser = {
            id: message.id,
            text: message.text,
            sender: user.username, // Додати ім'я користувача в sender
            createdAt: message.createdAt // Додати час створення повідомлення
        };

        res.status(201).json(messageWithUser);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Отримати всі повідомлення для певного чату
        const messages = await Message.findAll({ where: { chatId } });



        // Проходження кожного повідомлення
        const enrichedMessages = await Promise.all(messages.map(enrichMessage));

        // Повернення збагачених повідомлень у відповідь
        res.json(enrichedMessages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const enrichMessage = async (message)=> {
    // Отримання інформації про користувача за ідентифікатором
    const user = await User.findByPk(message.userId, { attributes: ['id', 'username'] });

    // Формування збагаченого об'єкту повідомлення з інформацією про користувача
    const enrichedMessage = {
        id: message.id,
        text: message.text,
        sender: user ? user.username : 'Unknown',
        createdAt: message.createdAt,
        chatId: message.chatId
    };

    return enrichedMessage;
}

module.exports = {
    createChat,
    enrichMessage,
    getChatMessages,
    createMessage,
    getUserChats
};