const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Auction = sequelize.define('Auction', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  itemId: {  // Verifique se "itemId" é o nome correto
    type: DataTypes.STRING, 
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
      model: 'Users',
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
      model: 'Users',
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
