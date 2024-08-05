const express = require('express');
const itemController = require('../controllers/item.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rota para adicionar um novo item (requer autenticação)
router.post('/items', authMiddleware, itemController.addItem);

router.get('/items', itemController.getAllItems);

module.exports = router;
