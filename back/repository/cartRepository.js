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

    const cartItem = cart.cartItems.find(item => item.product.id == product.id);

    if (cartItem) {
        cartItem.quantity++;
        exports.calculateCartItemTotalPrice(cartItem);
        return cartItem;
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
        exports.calculateCartItemTotalPrice(cart.cartItems[index]);
        if (cart.cartItems[index].quantity <= 0) {
            cart.cartItems.splice(index, 1);
            return {};
        }
        return cart.cartItems[index];
    } else {
        throw Error('No cart item found');
    }

}

exports.calculateCartItemTotalPrice = (cartItem) => {
    cartItem.totalPrice = parseFloat((cartItem.product.price * cartItem.quantity).toFixed(2));
}

exports.calculateCartTotalPrice = (cart) => {
    cart.totalPrice = parseFloat(cart.cartItems.reduce((prev, next) => prev + next.totalPrice, 0).toFixed(2));
}

exports.placeOrder = (user) => {
    const index = carts.findIndex(item => item.user.username == user.username);

    if (index >= 0) {
        carts.splice(index, 1);
    }

}