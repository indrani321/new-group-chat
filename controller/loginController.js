const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../database/db');
const User = require('../models/user');
const { generateAccessToken } = require('../utils/token');


async function loginUser(req, res) {
  try {
    const { email, password,} = req.body;
    const user = await User.findAll({ where: { email: email } });

    if(user.length>0){
      bcrypt.compare(password,user[0].password,async(err,result)=>{
          if(err){
              res.status(400).json({message:"Something is wrong"});
          }

          if(result==true){
              res.status(200).json({message:"successfully login",token:generateAccessToken(user[0].id,user[0].email,user[0].name)});
          }
          else{
              return res.status(400).json({message:"password is wrong"});
          }
      })
  }
  else{
      return res.status(400).json({message:"user does not exist"})
  }
}
catch(err){
  console.log(err);
}
}

function getLoginPage(req,res,next){
    res.sendFile(path.join(__dirname,'../views/login.html'))
  }
  

  module.exports = {
    getLoginPage,
    loginUser,
  };


  



    

