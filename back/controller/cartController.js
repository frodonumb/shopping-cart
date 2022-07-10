const repository = require('../repository/cartRepository');
const accessSecurity = require('../auth-util/access-security');
const Product = require('../domain/product');
const jsonReplacer = require('../util/json-replacer');

exports.getCart = (req, res) => {
    const user = accessSecurity.getUserBySession(req);

    const cart = repository.getCart(user);

    if (cart) {
        repository.calculateCartTotalPrice(cart);
        res.json(jsonReplacer.replace(cart, jsonReplacer.cartInfoReplacer));
    } else {
        res.json({ cartItems: [] });
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
    const cartItem = cartItems.length > 1 ? cartItems[cartItems.length - 1] : cartItems[0];

    repository.calculateCartItemTotalPrice(cartItem);
    
    if (cartItems.length > 1) {
        res.status(200).json(jsonReplacer.replace(cartItem, jsonReplacer.cartInfoReplacer));
    } else {
        res.status(201).json(jsonReplacer.replace(cartItem, jsonReplacer.cartInfoReplacer));
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
        const cartItem = repository.increaseQuantity(user, product);        
        res.json(jsonReplacer.replace(cartItem, jsonReplacer.cartInfoReplacer));
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
        res.send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}