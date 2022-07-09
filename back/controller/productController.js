const Product = require('../domain/product');

exports.getAll = (req, res) => {
    res.json(Product.getAll());
}