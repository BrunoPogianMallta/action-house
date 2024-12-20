const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database'); 
const routes = require('./routes');
const cors = require('cors');
require('./utils/cronjobs');
require('dotenv').config();

const app = express();


const corsOptions = {
    origin: [process.env.LOCAL_FRONTEND_URL, process.env.FRONTEND_URL, 'localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', routes);


const PORT = process.env.PORT || 3000;


(async () => {
    try {
        
        await connectToDatabase();  
        await sequelize.sync(); 
        
        
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
})();
