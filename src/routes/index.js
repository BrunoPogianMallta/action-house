const express = require('express');
const userRoutes = require('./user.Routes');
const itemRoutes = require('./item.Routes');

const router = express.Router();

router.use(userRoutes);
router.use(itemRoutes);

module.exports = router;
