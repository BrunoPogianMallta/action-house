const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.APP_ENV === 'production';


const sequelize = new Sequelize(
    isProduction
        ? process.env.DATABASE_URL
        : `postgres://${process.env.LOCAL_DB_USER}:${process.env.LOCAL_DB_PASSWORD}@${process.env.LOCAL_DB_HOST}:${process.env.LOCAL_DB_PORT}/${process.env.LOCAL_DB_NAME}`,
    {
        dialect: 'postgres',
        dialectOptions: isProduction
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false, // Necessário para servidores sem certificados confiáveis
                },
            }
            : {},
        logging: false,
    }
);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
};

module.exports = { sequelize, connectToDatabase };
