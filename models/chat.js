const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Message = sequelize.define('Message',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
      },
    message:{
        type: DataTypes.STRING,
        allowNull: false,
        },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    }
    
});

module.exports= Message;