const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid'); 

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.STRING,  // ID está definido como STRING
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
      model: 'Users', // Certifique-se de que o nome da tabela Users está correto
      key: 'id',
    }
  }
  
}, {
  tableName: 'Items', 
  timestamps: true,
  hooks: {
    beforeCreate: (item) => {
      const prefix = Item.tableName.toUpperCase() + '_';
      item.id = `${prefix}${uuidv4()}`;  // Gera ID com prefixo baseado no nome da tabela
    }
  }
});

module.exports = Item;
