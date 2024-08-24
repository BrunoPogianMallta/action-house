require('dotenv').config();
const { Sequelize } = require('sequelize');


const databaseUrl = process.env.DATABASE_URL || 
    `postgres://${process.env.LOCAL_DB_USER}:${process.env.LOCAL_DB_PASSWORD}@localhost:5432/${process.env.LOCAL_DB_NAME}`;

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: process.env.DATABASE_URL ? { 
            require: true,
            rejectUnauthorized: false
        } : undefined
    }
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectToDatabase };
