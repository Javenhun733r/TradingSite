const db = require('../Models');
const jwt = require("jsonwebtoken");
const Chat = db.chats;
const Message = db.messages;
const User = db.users;
const UserChat = db.userChats;
const {EMAIL, PASSWORD} = require("../../env") ;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});
const createChat = async (req, res) => {
    try {
        const { name, userIds } = req.body;

        const chat = await Chat.create({ name });
        const chatId = chat.id;
        const decoded = jwt.verify(userIds[0], process.env.secretKey);
        userIds[0] = decoded.id;
        const userChatPromises = userIds.map(async (userId) => {
            await UserChat.create({ userId, chatId });
        });

        // Wait for all UserChat creations to complete
        await Promise.all(userChatPromises);
        const ownerOfBook = await User.findByPk(userIds[1])
        const mailOptions = {
            from: `"BookTrader"${EMAIL}`,
            to: ownerOfBook.email,
            subject: `Вітаю ${ownerOfBook.username}, з вами створили ${chat.name}`,
            text: `Ви отримали повідомлення у  ${chat.name}`
        };
        await transporter.sendMail(mailOptions);
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
            sender: user.username,
            createdAt: message.createdAt
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
const getChatMembers = async (req, res) => {
    const { chatId } = req.params;
    try {
        const userChats = await UserChat.findAll({ where: { chatId } });

        const users = [];

        await Promise.all(userChats.map(async (userChat) => {
            const user = await User.findByPk(userChat.userId);
            if (user) {
                users.push({
                    username: user.username,
                });
            }
        }));

        res.json(users);
    } catch (error) {
        console.error('Error fetching chat members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const deleteChat = async (req, res) => {
    const { chatId } = req.params;
    try {
        const chat = await Chat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        // Видалення чату
        await chat.destroy();

        // Знаходження та видалення всіх зв'язаних записів UserChat
        const userChats = await UserChat.findAll({ where: { chatId } });
        await Promise.all(userChats.map(async (userChat) => {
            await userChat.destroy();
        }));

        res.status(204).end(); // Відповідь статусом 204 (No Content)
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createChat,
    getChatMembers,
    enrichMessage,
    getChatMessages,
    createMessage,
    getUserChats,
    deleteChat
};