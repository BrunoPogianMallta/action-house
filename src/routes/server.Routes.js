const express = require('express');
const { addServer, getServers } = require('../controllers/server.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add-server', authMiddleware, addServer);
router.get('/get-servers',authMiddleware,getServers)

module.exports = router;
