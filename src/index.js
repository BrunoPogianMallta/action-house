const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database'); 
const routes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para parsing do corpo da requisição

// Middleware para parsing de dados de formulário (opcional, caso esteja usando formulários)
app.use(express.urlencoded({ extended: true }));

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
