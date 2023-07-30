const express = require('express');

const router = express.Router();
const loginControllers = require('../controllers/login');

router.get('/login',loginControllers.getloginPage);

router.post('/login',loginControllers.postCheckUser);

module.exports=router;