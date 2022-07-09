module.exports = class CartItem {

    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    static createFromProduct(product) {
        return new CartItem(product, 1);
    }

}