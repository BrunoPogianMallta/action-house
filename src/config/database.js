const { Sequelize } = require('sequelize');
require('dotenv').config();

// Conexão ao banco de dados remoto usando a variável DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Necessário para servidores sem certificados confiáveis
        },
    },
    logging: false,  // Desativa o log de queries
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();  // Tenta autenticar com o banco de dados remoto
        console.log('Conexão com o banco de dados remoto estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados remoto:', error);
    }
};

module.exports = { sequelize, connectToDatabase };
