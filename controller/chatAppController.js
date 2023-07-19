const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../database/db');
const User = require('../models/user');
const Message= require('../models/chat')
const { generateAccessToken } = require('../utils/token');

function chatApppage(req,res,next){
    res.sendFile(path.join(__dirname,'../views/chatApp.html'))
  }
  
async function addChat  (req, res, next) {
    const msg = req.body.message;
    
  
    const t = await db.transaction();
    try {
      const result = await Message.create(
        {
          message: msg,
          userId: req.user.id,
          name: req.user.name
        },
  
        { transaction: t }
      );
      await t.commit();
      res.status(201).json({ newMessage: result });
    } catch (err) {
      await t.rollback();
      console.log(err);
    }
  }


  async function showChat(req, res) {
      try {
         const messages = await Message.findAll();
        res.json(messages);
      } catch (error) {
        console.error('Error retrieving expenses:', error);
        res.status(500).send('Internal server error');
      }
    }
  module.exports = {
    chatApppage,
    addChat,
    showChat,
  }

  