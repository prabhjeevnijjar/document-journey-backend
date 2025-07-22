const express = require('express');
// const shopRoutes = require('./shops/routes');
const authRouter = require('./auth/routes');

const router = express.Router();

// router.use('/shops', shopRoutes);
router.use('/auth', authRouter);

module.exports = router;
