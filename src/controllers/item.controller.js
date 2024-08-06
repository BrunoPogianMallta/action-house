const { Item, User, Server} = require('../models');
const { Op } = require('sequelize');
const { ITEM_TYPES } = require('../utils'); 


const SALE_DURATIONS = [12, 24, 48];

exports.addItem = async (req, res) => {
  const { itemName, itemType, saleDuration, server, price } = req.body;
  const sellerId = req.user?.id;

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

    // Verifica se o servidor é válido
    const validServer = await Server.findOne({ where: { serverName: server } });
    if (!validServer) {
      return res.status(400).json({ message: 'Invalid server' });
    }

    if (!Object.values(ITEM_TYPES).includes(itemType)) {
      return res.status(400).json({ message: 'Invalid item type' });
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


exports.buyItem = async (req, res) => {
  const { itemId } = req.body;
  const buyerId = req.user.id;

  try {
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const buyer = await User.findByPk(buyerId);

    if (buyer.balance < item.price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduz o preço do item do saldo do comprador
    buyer.balance -= item.price;
    await buyer.save();

    // Opcional: atualizar o status do item ou transferir a posse para o comprador

    res.status(200).json({ message: 'Item purchased successfully' });
  } catch (error) {
    console.error('Error purchasing item:', error);
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





exports.getItemTypes = (req, res) => {
  try {
    // Estrutura o JSON de resposta
    const response = {
      itemTypes: Object.values(ITEM_TYPES) // Extrai os valores dos tipos de itens
    };
    res.status(200).json(response); // Retorna o JSON estruturado
  } catch (error) {
    console.error('Error fetching item types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.searchItemsByName = async (req, res) => {
  const { itemName } = req.query;

  if (!itemName) {
    return res.status(400).json({ message: 'Nome do item é obrigatório' });
  }

  try {
    const items = await Item.findAll({
      where: {
        itemName: {
          [Op.iLike]: `%${itemName}%`, // Ignora maiúsculas e minúsculas
        },
      },
    });

    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ message: 'Erro ao buscar itens', error: error.message || error });
  }
};
