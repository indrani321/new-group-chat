const express = require('express');

const router = express.Router();
const signupControllers = require('../controllers/signup');

router.get('/',signupControllers.getHomePage);

router.post('/signup',signupControllers.postAddUser);

module.exports=router;