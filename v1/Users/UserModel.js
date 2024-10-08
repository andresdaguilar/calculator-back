const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL,
    defaultValue: 100,
    allowNull: false
  }
},
  {
    paranoid: true,
  }
);

module.exports = User;
