const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../database/db');
const User = require('../models/user');





async function createUser(req, res, next) {
  try {
    const { name, email, password,phno } = req.body;
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(400).send('Email ID already exists');
    }
    const saltRounds=10;
    bcrypt.hash(password,saltRounds,async(err,hash)=>{
    const result = await User.create({name:name,email:email,password:hash,phno:phno});
    res.status(201).json({newSignUp:result});
        })
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
}


async function getUser(req, res, next) {
  try {
    const users = await User.findAll({}, 'name');
    
    res.status(200).json(users); // Return the usernames as 'name' property
  } catch (error) {
    console.error('Error retrieving usernames:', error);
    res.status(500).send('Internal Server Error');
  }
}




function getSignPage(req,res,next){
  res.sendFile(path.join(__dirname,'../views/signup.html'))
}

module.exports = {
  createUser,
  getSignPage,
  getUser,
};