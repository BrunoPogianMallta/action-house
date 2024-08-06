const express = require('express');
const userRoutes = require('./user.Routes');
const itemRoutes = require('./item.Routes');
const balanceRoutes = require('./balance.routes');
const serverRoutes = require('./server.Routes');


const router = express.Router();

router.use(userRoutes);
router.use(itemRoutes);
router.use(balanceRoutes);
router.use(serverRoutes);

module.exports = router;
