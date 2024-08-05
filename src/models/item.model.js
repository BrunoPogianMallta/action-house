const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { ITEM_TYPES } = require('../utils');

const Item = sequelize.define('Item', {
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [Object.values(ITEM_TYPES)],
    },
  },
  saleDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[12, 24, 48]],
    },
  },
  server: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'id'
    }
  }
});

module.exports = Item;
