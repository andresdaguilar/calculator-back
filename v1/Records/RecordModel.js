const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('../Users/UserModel');
const Operation = require('../Operations/OperationModel');

const Record = sequelize.define('Record', {
  operation_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Operation,
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  user_balance: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  operation_response: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  paranoid: true, 
});

module.exports = Record;