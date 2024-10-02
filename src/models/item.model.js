const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid'); 

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.STRING, 
    primaryKey: true,
  },
  itemName: {
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
  saleExpirationDate: {  
    type: DataTypes.DATE,
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

      // Calcula a data de expiração da venda com base na duração da venda
      item.saleExpirationDate = new Date(Date.now() + item.saleDuration * 3600 * 1000);
    }
  }
});

module.exports = Item;
