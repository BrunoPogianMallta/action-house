const User = require('../models/user.model');
const Item = require('../models/item.model');
const Server = require('../models/server.model');
const Auction = require('./auction.model');

// Relacionamentos
User.hasMany(Item, { foreignKey: 'sellerId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.hasMany(Auction, { foreignKey: 'sellerId', as: 'auctions' });
Auction.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.hasMany(Auction, { foreignKey: 'buyerId', as: 'purchases' });
Auction.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

Item.hasMany(Auction, { foreignKey: 'itemId', as: 'auctions' });
Auction.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

module.exports = { User, Item, Server, Auction };
