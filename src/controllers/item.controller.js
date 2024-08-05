const { Item, User } = require('../models');
const { ITEM_TYPES } = require('../utils');

const SERVER_LIST = ['Server1', 'Server2', 'Server3'];
const SALE_DURATIONS = [12, 24, 48];

exports.addItem = async (req, res) => {
  const { itemName, itemType, saleDuration, server, price } = req.body;
  const sellerId = req.user?.id;

  // Logs detalhados para depuração
  console.log('Request Body:', req.body); 
  console.log('item name:', itemName); 
  console.log('Request User:', req.user); 
  console.log('Seller ID:', sellerId); 

  try {
    if (!itemName) {
      console.log('Missing itemName');
      return res.status(400).json({ message: 'All fields are required: itemName is missing' });
    }
    if (!itemType) {
      console.log('Missing itemType');
      return res.status(400).json({ message: 'All fields are required: itemType is missing' });
    }
    if (!saleDuration) {
      console.log('Missing saleDuration');
      return res.status(400).json({ message: 'All fields are required: saleDuration is missing' });
    }
    if (!sellerId) {
      console.log('Missing sellerId');
      return res.status(400).json({ message: 'All fields are required: sellerId is missing' });
    }
    if (!server) {
      console.log('Missing server');
      return res.status(400).json({ message: 'All fields are required: server is missing' });
    }
    if (!price) {
      console.log('Missing price');
      return res.status(400).json({ message: 'All fields are required: price is missing' });
    }

    if (!Object.values(ITEM_TYPES).includes(itemType)) {
      return res.status(400).json({ message: 'Invalid item type' });
    }

    if (!SERVER_LIST.includes(server)) {
      return res.status(400).json({ message: 'Invalid server' });
    }

    if (!SALE_DURATIONS.includes(saleDuration)) {
      return res.status(400).json({ message: 'Invalid sale duration' });
    }

    const item = await Item.create({ itemName, itemType, saleDuration, server, price, sellerId });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllItems = async (req, res) => {
  try {
   
    const items = await Item.findAll({
      include: [{
        model: User,
        as: 'seller',
        attributes: ['name'] // Inclui apenas o nome do selller
      }],
      attributes: ['itemName', 'itemType', 'saleDuration', 'server', 'price']
    });

    res.status(200).json(items.map(item => ({
      itemName: item.itemName,
      itemType: item.itemType,
      saleDuration: item.saleDuration,
      server: item.server,
      price: item.price,
      sellerName: item.seller?.name 
    })));
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
