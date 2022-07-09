let carts = [];
const Cart = require('../domain/cart');
const CartItem = require('../domain/cartItem');


function addProduct(cartItems, cartItem) {
    const index = cartItems.findIndex(item => item.product.id == cartItem.product.id);

    if (index >= 0) {
        cartItems[index].quantity++;
    } else {
        cartItems.push(cartItem);
    }
}

exports.getCart = (user) => {
    return carts.find(item => item.user.username === user.username);
}


exports.addProduct = (user, product) => {
    let cart = carts.find(item => item.user.username === user.username);

    if (cart) {
        addProduct(cart.cartItems, CartItem.createFromProduct(product));
    } else {
        cart = new Cart(user, [CartItem.createFromProduct(product)]);
        carts.push(cart);
    }

    return cart.cartItems;
}


exports.increaseQuantity = (user, product) => {
    let cart = carts.find(item => item.user.username === user.username);

    if (!cart) {
        throw Error('Cart not found');
    }

    const index = cart.cartItems.findIndex(item => item.product.id == product.id);

    if (index >= 0) {
        cart.cartItems[index].quantity++;
    } else {
        throw Error('No cart item found');
    }

}

exports.decreaseQuantity = (user, product) => {
    let cart = carts.find(item => item.user.username === user.username);

    if (!cart) {
        throw Error('Cart not found');
    }

    const index = cart.cartItems.findIndex(item => item.product.id == product.id);

    if (index >= 0) {
        cart.cartItems[index].quantity--;

        if (cart.cartItems[index].quantity <= 0) {
            cart.cartItems.splice(index, 1);
        }
    } else {
        throw Error('No cart item found');
    }

}