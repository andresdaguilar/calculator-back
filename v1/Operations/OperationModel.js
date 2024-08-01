const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Operation = sequelize.define('Operation', {
  type: {
    type: DataTypes.ENUM('addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string'),
    allowNull: false,
  },
  cost: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = Operation;