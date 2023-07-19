const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();
const authentication = require('../middleware/auth');

const groupMessageController = require('../controller/groupMessageController');


router.post('/save-group',authentication.authenticate,groupMessageController.saveGroup);
router.get('/get-group', groupMessageController.getGroup);
router.get('/get-group-name',groupMessageController.getGroupName);
router.get('/groups/:groupId/members',groupMessageController.getGroupmembers);
router.get('/group-chat/:id',groupMessageController.getGroupPage)




module.exports=router;