const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { ITEM_TYPES } = require('../utils');
const { v4: uuidv4 } = require('uuid'); 

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  itemName: {  // Verifique se "itemName" é o nome correto
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  saleDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  }
}, {
  tableName: 'Items', 
  timestamps: true,
  hooks: {
    beforeCreate: (item) => {
      const prefix = Item.tableName.toUpperCase() + '_';
      item.id = `${prefix}${uuidv4()}`;
    }
  }
});

module.exports = Item;
