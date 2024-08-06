const { Server } = require('../models');
const { ITEM_TYPES, SERVER_LIST } = require('../utils'); 

exports.addServer = async (req, res) => {
  const { serverName } = req.body;

  if (!serverName) {
    return res.status(400).json({ message: 'Server name is required.' });
  }

  try {
    // servidor já está cadastrado?
    const serverExists = await Server.findOne({ where: { serverName } });

    if (serverExists) {
      return res.status(409).json({ message: 'Server already registered.' });
    }

    // Cria novo servidor
    const newServer = await Server.create({ serverName });

    return res.status(201).json({ 
      message: 'Server added successfully.', 
      server: newServer 
    });
  } catch (error) {
    console.error('Error adding server:', error);
    return res.status(500).json({ 
      message: 'Internal server error.',
      error: error.message 
    });
  }
};


exports.getServers = async (req, res) => {
  try {
    const servers = await Server.findAll({ attributes: ['serverName'] });
    res.status(200).json({ servers: servers.map(server => server.serverName) });
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
