const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database'); 
const routes = require('./routes');
const cors = require('cors');
require('dotenv').config(); // Certifique-se de que as variáveis de ambiente estão carregadas

const app = express();

// Configurar CORS para permitir solicitações do frontend
const corsOptions = {
    origin:  'http://localhost:3000', // URL do frontend, altere conforme necessário
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware para parsing do corpo da requisição
app.use(express.urlencoded({ extended: true })); // Middleware para parsing de dados de formulário

app.use('/api/v1', routes);

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await connectToDatabase();  
        await sequelize.sync(); 
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
