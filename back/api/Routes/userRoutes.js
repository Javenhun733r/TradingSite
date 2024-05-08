const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login, getUserName } = userController
const userAuth = require('../Middlewares/userAuth')
const {getAllItems, createItem, getCurrentUserItems, deleteItem, getPhoto, updateItem, getCategories} = require('../Controllers/itemsController')
const router = express.Router()
const multer = require('multer');
const upload = multer();
const chatController = require('../Controllers/chatController')
router.post('/signup', userAuth.saveUser, signup)
router.get('/getUserName', getUserName)
router.post('/login', login )
router.get('/items',  getAllItems)
router.get('/itemsUser',  getCurrentUserItems)
router.put('/items/:itemId', updateItem)
router.post('/create_item', upload.any(), createItem)
router.delete('/items/:itemId', deleteItem)
router.get('/item', getPhoto)
router.post('/chats', chatController.createChat);
router.get('/chats', chatController.getUserChats);
router.get('/chats/:chatId/messages', chatController.getChatMessages);
router.post('/chats/:chatId/messages', chatController.createMessage);
router.get('/categories', getCategories);
module.exports = router