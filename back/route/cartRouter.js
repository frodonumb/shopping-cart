const express = require('express');
const cartController = require('../controller/cartController');
const router = express.Router();

router.get('', cartController.getCart);
router.post('', cartController.addProduct);
router.post('/place-order', cartController.placeOrder);
router.patch('/cart-item/:productId/increase-quantity', cartController.increaseCartItemQuantity);
router.patch('/cart-item/:productId/decrease-quantity', cartController.decreaseCartItemQuantity);

module.exports = router;