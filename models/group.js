const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Group = sequelize.define('group',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    groupname:{
        type: DataTypes.STRING,
        allowNull: false,
        },
        created_by: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        
    
  
});

module.exports= Group;