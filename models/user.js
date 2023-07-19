const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('user',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phno:{
        type: DataTypes.BIGINT,
        allowNull:false,
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
  }
  
});

module.exports= User;