const express = require('express');
const balanceController = require('../controllers/balance.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add-balance', authMiddleware, balanceController.addBalance);

module.exports = router;
