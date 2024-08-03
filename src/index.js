const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, connectToDatabase } = require('./config/database'); 
const routes = require('./routes');
const models = require('./models');

const app = express();


app.use(bodyParser.json())
app.use('/api/v1', routes);

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
