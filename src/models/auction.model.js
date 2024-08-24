const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Auction = sequelize.define('Auction', {
  id: {
    type: DataTypes.STRING,  
    primaryKey: true,
  },
  itemId: {
    type: DataTypes.STRING,  // Deve ser o mesmo tipo que 'id' em 'Items'
    allowNull: false,
    references: {
      model: 'Items',
      key: 'id',
    },
  },
  sellerId: {
    type: DataTypes.STRING,  
    allowNull: false,
    references: {
      model: 'Users', // Certifique-se de que o nome da tabela Users está correto
      key: 'id',
    },
  },
  itemType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  server: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  saleExpirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  buyerId: {
    type: DataTypes.STRING,  
    allowNull: true,
    references: {
      model: 'Users', // Certifique-se de que o nome da tabela Users está correto
      key: 'id',
    },
  },
  isSold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'auctions',
  timestamps: true,
  hooks: {
    beforeCreate: (auction) => {
      const prefix = Auction.tableName.toUpperCase() + '_';
      auction.id = `${prefix}${uuidv4()}`;  
    }
  }
});

module.exports = Auction;
