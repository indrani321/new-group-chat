const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();
const loginController = require('../controller/loginController');


router.get('/login',loginController.getLoginPage);
router.post('/login/success',loginController.loginUser);


module.exports=router;