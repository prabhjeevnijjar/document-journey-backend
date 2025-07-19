const express = require('express');
const shopRoutes = require('./shops/routes');

const router = express.Router();

/**
 * GET v1/shops
 */
router.use('/shops', shopRoutes);

module.exports = router;
