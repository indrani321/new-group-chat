const jwt = require('jsonwebtoken');
const User= require('../models/user');
const dotenv= require('dotenv');
dotenv.config();


const authenticate = async (req, res, next) => {

    try{
    let token = req.header('Authorization')
     const userObj = jwt.verify(token,process.env.YOUR_KEY);
     const user = await User.findByPk(userObj.userId);
     req.user=user;
     next();
 }
 catch(err){
     console.log(err);
 }
}

module.exports={
    authenticate,
}