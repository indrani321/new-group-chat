const express =require ('express');
const path = require('path');
const db = require('../database/db');
const authentication = require('../middleware/auth');
const router =express.Router();
const chatAppController = require('../controller/chatAppController');


router.get('/chatapp',chatAppController.chatApppage);
router.post('/add-chat', authentication.authenticate, chatAppController.addChat);
router.get('/show-chat',chatAppController.showChat);



module.exports=router;