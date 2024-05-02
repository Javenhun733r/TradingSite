const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login, getUserName } = userController
const userAuth = require('../Middlewares/userAuth')
const {getAllItems, createItem, getCurrentUserItems, deleteItem, getPhoto} = require('../Controllers/itemsController')
const router = express.Router()
const upload = require('../Middlewares/photoSaving')

router.post('/signup', userAuth.saveUser, signup)
router.get('/getUserName', getUserName)
router.post('/login', login )
router.get('/items',  getAllItems)
router.get('/itemsUser',  getCurrentUserItems)
router.post('/create_item', upload.array('photos', 5), createItem)
router.delete('/:itemId', deleteItem)
router.get('/item', getPhoto)
module.exports = router