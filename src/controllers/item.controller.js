const { Item, User, Server, Auction } = require('../models');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid'); 
const { Op } = require('sequelize');
const { ITEM_TYPES } = require('../utils'); 

const SALE_DURATIONS = [12, 24, 48];

// Função para validar dados de item
const validateItemData = ({ itemName, itemType, saleDuration, server, price }) => {
  const errors = [];

  if (!itemName) errors.push('itemName is missing');
  if (!itemType) errors.push('itemType is missing');
  if (!saleDuration) errors.push('saleDuration is missing');
  if (!price) errors.push('price is missing');
  if (!Object.values(ITEM_TYPES).includes(itemType)) errors.push('Invalid item type');
  if (!SALE_DURATIONS.includes(saleDuration)) errors.push('Invalid sale duration');

  return errors;
};

// Função para enviar resposta de erro
const sendErrorResponse = (res, status, message) => {
  console.log(message);
  res.status(status).json({ message });
};

exports.addItem = async (req, res) => {
  const { itemName, itemType, saleDuration, server, itemQuantity, price } = req.body;
  const sellerId = req.user?.id;

  try {
    
    const errors = validateItemData({ itemName, itemType, saleDuration, server, itemQuantity, price });
    if (errors.length > 0) return sendErrorResponse(res, 400, `Validation errors: ${errors.join(', ')}`);
    
    if (!sellerId) return sendErrorResponse(res, 400, 'sellerId is missing');

    
    const validServer = await Server.findOne({ where: { serverName: server } });
    if (!validServer) return sendErrorResponse(res, 400, 'Invalid server');

    
    const saleExpirationDate = new Date(Date.now() + saleDuration * 3600 * 1000);

    
    const item = await Item.create({
      itemName,
      itemType,
      saleDuration,
      saleExpirationDate,  
      server,
      price,
      itemQuantity,
      sellerId
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.buyItem = async (req, res) => {
  const { itemId } = req.body;
  const buyerId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    
    const item = await Item.findByPk(itemId, { transaction });
    if (!item) {
      console.log('Item not found:', itemId);
      await transaction.rollback();
      return res.status(404).json({ message: 'Item not found' });
    }

    
    const buyer = await User.findByPk(buyerId, { transaction });
    if (!buyer) {
      console.log('Buyer not found:', buyerId);
      await transaction.rollback();
      return res.status(404).json({ message: 'Buyer not found' });
    }

    if (buyer.balance < item.price) {
      console.log('Insufficient balance for buyer:', buyerId);
      await transaction.rollback();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    
    buyer.balance -= item.price;
    await buyer.save({ transaction });

    
    const auction = await Auction.create({
      itemId: item.id, 
      sellerId: item.sellerId,
      itemType: item.itemType,
      server: item.server,
      postedDate: new Date(),
      saleExpirationDate: new Date(Date.now() + item.saleDuration * 3600 * 1000), 
      buyerId: buyerId,
      isSold: true,
    }, { transaction });

    console.log('Auction created:', auction);

    
    const createdAuction = await Auction.findByPk(auction.id, { transaction });
    console.log('Created Auction:', createdAuction);

    
    await item.destroy({ transaction });
    console.log('Item removed successfully:', itemId);

    await transaction.commit();

    res.status(200).json({ message: 'Item purchased successfully', auction });
  } catch (error) {
    console.error('Error purchasing item:', error);
    await transaction.rollback();
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [{
        model: User,
        as: 'seller',
        attributes: ['name']
      }],
      attributes: ['id', 'itemName', 'itemType', 'itemQuantity', 'saleDuration', 'saleExpirationDate', 'server', 'price']
    });

    res.status(200).json(items.map(item => ({
      itemId: item.id,
      itemName: item.itemName,
      itemType: item.itemType,
      saleDuration: item.saleDuration,
      saleExpirationDate: item.saleExpirationDate, 
      server: item.server,
      price: item.price,
      quantity: item.itemQuantity,
      sellerName: item.seller?.name,
    })));
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getItemTypes = (req, res) => {
  try {
    const response = {
      itemTypes: Object.values(ITEM_TYPES)
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching item types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.searchItemsByName = async (req, res) => {
  const { itemName } = req.query;

  if (!itemName) return sendErrorResponse(res, 400, 'itemName is required');

  try {
    const items = await Item.findAll({
      where: {
        itemName: {
          [Op.iLike]: `%${itemName}%`,
        },
      },
    });

    res.json(items);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ message: 'Error searching items', error: error.message || error });
  }
};

exports.searchItemsByServer = async (req, res) =>{
  const { serverName } = req.query;
  if(!serverName) return sendErrorResponse(res,400,'ServerName is required');
  try {
    const items= await Item.findAll({
      where: {
        server:{
          [Op.iLike]: `%${serverName}`,
        },
      },
    });
    res.json(items);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({message: 'Error searching items', error: error.message || error})
  }
}
