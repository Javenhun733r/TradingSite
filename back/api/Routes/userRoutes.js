const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login } = userController
const userAuth = require('../Middlewares/userAuth')
const {getAllItems, createItem} = require('../Controllers/itemsController')
const router = express.Router()

router.post('/signup', userAuth.saveUser, signup)

router.post('/login', login )
router.get('/items',  getAllItems)
router.post('/create_item', createItem);
module.exports = router