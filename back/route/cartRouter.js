const express = require('express');
const cartController = require('../controller/cartController');
const router = express.Router();

router.get('', cartController.getCart);
router.post('', cartController.addProduct);

module.exports = router;