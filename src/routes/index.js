const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

//rotas
router.post('/register', userController.registerUser);


module.exports = router;
