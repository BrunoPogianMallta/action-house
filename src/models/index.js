const User = require('./user.model');
const Item = require('./item.model');

// Defina as associações
User.hasMany(Item, { foreignKey: 'sellerId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = { User, Item };
