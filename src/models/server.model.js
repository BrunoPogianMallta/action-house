const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid'); 

const Server = sequelize.define('Server', {
  id: {
    type: DataTypes.STRING, 
    primaryKey: true
  },
  serverName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (server) => {
      const prefix = Server.tableName.toUpperCase() + '_'; 
      server.id = `${prefix}${uuidv4()}`; // Gera o UUID com o prefixo
    }
  }
});

module.exports =  Server ;
