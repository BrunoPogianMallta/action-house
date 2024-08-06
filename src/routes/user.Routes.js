const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);
router.get('/user',authMiddleware, userController.getUserDetails);

module.exports = router;
