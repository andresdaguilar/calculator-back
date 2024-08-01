const express = require('express');
const router = express.Router();

const userRoutes = require('./Users/routes');
const operationRoutes = require('./Operations/routes');
const recordRoutes = require('./Records/routes');

router.use('/user', userRoutes);
router.use('/operation', operationRoutes);
router.use('/record', recordRoutes);

module.exports = router;