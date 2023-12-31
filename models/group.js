const Sequelize = require('sequelize');
const User = require('./user');
const sequelize = require('../util/database');

const Group = sequelize.define('Group', {
  groupId: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  groupName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull:false,
  }
});

module.exports = Group;
