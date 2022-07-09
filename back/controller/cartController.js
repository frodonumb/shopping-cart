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

    const cartItems = repository.addProduct(user, product);

    if (cartItems.length > 1) {
        res.status(200).json(cartItems[cartItems.length - 1]);
    } else {
        res.status(201).json(cartItems[0]);
    }
}

