const express = require('express');
const itemController = require('../controllers/item.controller');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router()


// Rota para adicionar um novo item (requer autenticação)
router.post('/items', authMiddleware, itemController.addItem);
router.post('/buy-item', authMiddleware, itemController.buyItem);

router.get('/items', itemController.getAllItems);

// Endpoint para obter todos os tipos de itens
router.get('/item-types', itemController.getItemTypes);
router.get('/search', authMiddleware, itemController.searchItemsByName);
router.get('/get-itens-server-name', authMiddleware,itemController.searchItemsByServer);

module.exports = router;
