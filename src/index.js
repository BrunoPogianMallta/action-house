const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database'); 
const routes = require('./routes');
const cors = require('cors');
require('./utils/cronjobs');
require('dotenv').config();

const app = express();

// Configurações de CORS
const corsOptions = {
    origin: [process.env.LOCAL_FRONTEND_URL, process.env.FRONTEND_URL], // URLs permitidas para acessar o backend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true // Permitir envio de cookies e headers de autenticação
};

// Middlewares
app.use(cors(corsOptions)); // Configuração de CORS
app.use(express.json()); // Suporte para JSON no body
app.use(express.urlencoded({ extended: true })); // Suporte para formulários no body

// Rotas
app.use('/api/v1', routes);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
(async () => {
    try {
        // Conexão com o banco de dados
        await connectToDatabase();  
        await sequelize.sync(); 
        
        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Permitindo conexões de: ${process.env.LOCAL_FRONTEND_URL}, ${process.env.FRONTEND_URL}`);
        });
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
})();
