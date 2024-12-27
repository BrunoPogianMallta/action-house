const { Sequelize } = require('sequelize');
require('dotenv').config();

// Conexão ao banco de dados local
const sequelize = new Sequelize(
    `postgres://${process.env.LOCAL_DB_USER}:${process.env.LOCAL_DB_PASSWORD}@${process.env.LOCAL_DB_HOST}:${process.env.LOCAL_DB_PORT}/${process.env.LOCAL_DB_NAME}`,
    {
        dialect: 'postgres',
        dialectOptions: {},
        logging: false,  // Desativa o log de queries
    }
);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();  // Tenta autenticar com o banco de dados local
        console.log('Conexão com o banco de dados local estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados local:', error);
    }
};

module.exports = { sequelize, connectToDatabase };
