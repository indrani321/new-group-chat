const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const UserGroup = sequelize.define('usergroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

module.exports = UserGroup;
