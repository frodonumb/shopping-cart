const repository = require('../repository/cartRepository');
const accessSecurity = require('../auth-util/access-security');
const jsonReplacer = require('../util/json-replacer');
const Product = require('../domain/product');

exports.getCart = (req, res) => {
    const user = accessSecurity.getUserBySession(req);

    const cart = repository.getCart(user);

    if (cart) {
        res.json(jsonReplacer.repace(cart, jsonReplacer.cartInfoReplacer));
    } else {
        res.json({});
    }

}

exports.addProduct = (req, res) => {
    const user = accessSecurity.getUserBySession(req);

    if (!req.body || !req.body.productId) {
        res.status(400).json({ message: 'Validation error', fields: ['productId'] });
        return;
    }

    const product = Product.getById(req.body.productId);

    if (!product) {
        res.status(404).json({ message: 'Product not found!' });
        return;
    }


    if (product.stock <= 0) {
        res.status(400).json({ message: 'Out of stock' });
        return;
    }

    const cartItems = repository.addProduct(user, product);

    product.decreaseStockQuantity();

    if (cartItems.length > 1) {
        res.status(200).json(cartItems[cartItems.length - 1]);
    } else {
        res.status(201).json(cartItems[0]);
    }
}

exports.increaseCartItemQuantity = (req, res) => {
    const user = accessSecurity.getUserBySession(req);

    if (!req.params || !req.params.productId) {
        res.status(400).json({ message: 'Validation error', fields: ['productId'] });
        return;
    }

    const product = Product.getById(req.params.productId);

    if (!product) {
        res.status(404).json({ message: 'Product not found!' });
        return;
    }

    if (product.stock <= 0) {
        res.status(400).json({ message: 'Out of stock' });
        return;
    }

    try {
        repository.increaseQuantity(user, product);
        product.decreaseStockQuantity();
        res.send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

exports.decreaseCartItemQuantity = (req, res) => {

    const user = accessSecurity.getUserBySession(req);
    
    if (!req.params || !req.params.productId) {
        res.status(400).json({ message: 'Validation error', fields: ['productId'] });
        return;
    }

    const product = Product.getById(req.params.productId);

    if (!product) {
        res.status(404).json({ message: 'Product not found!' });
        return;
    }

    try {
        repository.decreaseQuantity(user, product);
        product.increaseStockQuantity();
        res.send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

