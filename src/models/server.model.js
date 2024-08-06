const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // Importa o pacote UUID

const Server = sequelize.define('Server', {
  id: {
    type: DataTypes.STRING, // Define o tipo como STRING para suportar UUIDs com prefixo
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
      const prefix = Server.tableName.toUpperCase() + '_'; // Usa o nome da tabela como prefixo
      server.id = `${prefix}${uuidv4()}`; // Gera o UUID com o prefixo
    }
  }
});

module.exports =  Server ;
