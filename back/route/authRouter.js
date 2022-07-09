const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();

router.post('/authenticate', authController.authenticate);

module.exports = router;