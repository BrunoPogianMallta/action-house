const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database'); 
const models = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await connectToDatabase();  
        
        await sequelize.sync(); 
        
        app.listen(PORT, () => {
            console.log(`Servidor conectado na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
