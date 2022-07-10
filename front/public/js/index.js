const baseUrl = 'http://localhost:8081';

window.onload = async function () {

    if (sessionStorage.getItem('sessionToken')) {
        initPage();
    } else {
        hideAuthorizedContainer();
        hideLogoutContainer();
    }

    document.getElementById('loginBtn').onclick = login;
    document.getElementById('logoutBtn').onclick = logout;
}

async function initPage() {
    showLogoutContainer();
    showAuthorizedContainer();
    loadProducts();
    loadCartItems();
    document.getElementById('welcomeLabel').value = sessionStorage.getItem('username');
    document.getElementById('placeOrderBtn').onclick = placeOrder;
}

function hideAuthorizedContainer() {
    document.getElementById('unAuthorizedContainer').style.display = 'block';
    document.getElementById('authorizedContainer').style.display = 'none';
}

function showAuthorizedContainer() {
    document.getElementById('unAuthorizedContainer').style.display = 'none';
    document.getElementById('authorizedContainer').style.display = 'block';
}

function hideLogoutContainer() {
    document.getElementById('logoutContainer').className = '';
    document.getElementById('logoutContainer').style.display = 'none';
    document.getElementById('loginContainer').className = 'd-flex';
    document.getElementById('loginContainer').style.display = 'flex!important';
}

function showLogoutContainer() {
    document.getElementById('loginContainer').className = '';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('logoutContainer').className = 'd-flex';
    document.getElementById('logoutContainer').style.display = 'flex!important';
}

function hideCartTable() {
    document.getElementById('noCartTitle').style.visibility = 'visible';
    document.getElementById('noCartTitle').style.display = 'inherit';
    document.getElementById('cartTable').style.display = 'none';
    document.getElementById('cartTable').style.visibility = 'visible';
    document.getElementById('placeOrderBtn').style.display = 'none';
    document.getElementById('placeOrderBtn').style.visibility = 'visible';
}

function showCartTable() {
    document.getElementById('noCartTitle').style.visibility = 'hidden';
    document.getElementById('noCartTitle').style.display = 'none';
    document.getElementById('cartTable').style.visibility = 'visible';
    document.getElementById('cartTable').style.display = 'table';
    document.getElementById('placeOrderBtn').style.display = '';
    document.getElementById('placeOrderBtn').style.visibility = 'visible';
}

function logout() {
    sessionStorage.clear();
    hideAuthorizedContainer();
    hideLogoutContainer();
    document.getElementById('productTableBody').innerHTML = '';
    document.getElementById('cartTableBody').innerHTML = '';
}

async function login(event) {
    event.preventDefault();

    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    if (!username || !password) {
        return;
    }

    const response = await fetch(`${baseUrl}/auth/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    });

    const body = await response.json();

    if (response.ok) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('sessionToken', body.token);

        initPage();

        username.value = '';
        password.value = '';
        
    } else {
        window.alert(body.message);
    }
}

async function loadProducts() {

    const response = await fetch(`${baseUrl}/products/`, {
        headers: {
            'authorization': 'tina:329837487473'
        }
    });
    const products = await response.json();

    let html = document.getElementById('productTableBody').innerHTML;

    products.forEach(item => {

        html += `
        <tr>
            <th scope="row">${item.name}</th>
            <td>$${item.price}</td>
            <td><img src="${baseUrl}${item.img}" width="40" height="40"/></td>
            <td>${item.stock}</td>
            <td>
                <button class="btn btn-outline-dark" onclick="addProduct(${item.id})"> <i class="bi bi-cart"></i>
                    Add to cart</button>
            </td>
        </tr>
        `;
    });
    document.getElementById('productTableBody').innerHTML = html;
}


async function loadCartItems() {
    const response = await fetch(`${baseUrl}/shopping-cart`, {
        headers: {
            'authorization': 'tina:329837487473'
        }
    });

    const cart = await response.json();

    if (!cart || !cart.cartItems || cart.cartItems.length == 0) {
        hideCartTable();
        return;
    } else {
        showCartTable();
    }


    cart.cartItems.forEach(item => {
        createCartItemRow(item);
    });

    createTotalPriceRow(cart);

}

async function increaseQuantity(productId) {
    const response = await fetch(`${baseUrl}/shopping-cart/cart-item/${productId}/increase-quantity`, {
        method: 'PATCH',
        headers: {
            'authorization': 'tina:329837487473'
        }
    });

    if (response.ok) {
        const cartItem = await response.json();

        document.getElementById(`cartItemQuantity${cartItem.product.id}`).setAttribute('value', cartItem.quantity);
        document.getElementById(`cartItemTotal${cartItem.product.id}`).innerHTML = `$${cartItem.totalPrice}`;
        updateCartTotalPrice(false);

    } else {
        const status = response.status;
        const error = await response.json();
        alert(error.message);
    }
}

async function decreaseQuantity(productId) {
    const response = await fetch(`${baseUrl}/shopping-cart/cart-item/${productId}/decrease-quantity`, {
        method: 'PATCH',
        headers: {
            'authorization': 'tina:329837487473'
        }
    });

    if (response.ok) {
        const cartItem = await response.json();

        if (cartItem.quantity) {
            document.getElementById(`cartItemQuantity${cartItem.product.id}`).setAttribute('value', cartItem.quantity);
            document.getElementById(`cartItemTotal${cartItem.product.id}`).innerHTML = `$${cartItem.totalPrice}`;
            updateCartTotalPrice(false);
        } else {
            const row = document.getElementById(`cartItemRow${productId}`)
            row.parentNode.removeChild(row);

            if (document.getElementById("cartTableBody").children.length <= 1) {
                document.getElementById("cartTableBody").removeChild(document.getElementById("totalPriceRow"));
                hideCartTable();
            }
        }

    } else {
        const status = response.status;
        const error = await response.json();
        alert(error.message)
    }
}

async function addProduct(productId) {
    const response = await fetch(`${baseUrl}/shopping-cart/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'tina:329837487473'
        },
        body: JSON.stringify({ productId: productId })
    });

    if (response.ok) {
        const cartItem = await response.json();
        showCartTable();
        if (document.getElementById(`cartItemRow${cartItem.product.id}`)) {
            document.getElementById(`cartItemQuantity${cartItem.product.id}`).setAttribute('value', cartItem.quantity);
            document.getElementById(`cartItemTotal${cartItem.product.id}`).innerHTML = `$${cartItem.totalPrice}`;
            updateCartTotalPrice(false);
        } else {
            document.getElementById("cartTableBody").deleteRow(document.getElementById("cartTableBody").children.length - 1);
            createCartItemRow(cartItem);
            updateCartTotalPrice(true);
        }

    } else {
        const status = await response.status;
        const error = await response.json();
        alert(error.message);
    }
}


function createCartItemRow(item) {

    let html = document.getElementById("cartTableBody").innerHTML;
    html += `
    <tr id="cartItemRow${item.product.id}">
            <th scope="row">${item.product.name}</th>
            <td>$${item.product.price}</td>
            <td id="cartItemTotal${item.product.id}">$${item.totalPrice}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-primary" onclick="decreaseQuantity(${item.product.id})">-</button>
                    <input type="text" value="${item.quantity}" size="3" class="text-center" readonly id="cartItemQuantity${item.product.id}">
                    <button type="button" class="btn btn-primary" onclick="increaseQuantity(${item.product.id})">+</button>
                </div>
            </td>
        </tr>
    `;

    document.getElementById('cartTableBody').innerHTML = html;
}

async function updateCartTotalPrice(addRow) {
    const response = await fetch(`${baseUrl}/shopping-cart`, {
        headers: {
            'authorization': 'tina:329837487473'
        }
    });

    const cart = await response.json();

    if (!cart || !cart.cartItems || cart.cartItems.length == 0) {
        hideCartTable();
        return;
    } else {
        showCartTable();
    }

    if (addRow) {
        createTotalPriceRow(cart);
    } else {
        document.getElementById("totalPrice").innerHTML = `Total: $${cart.totalPrice}`;
    }

}

function createTotalPriceRow(cart) {
    let html = document.getElementById("cartTableBody").innerHTML;

    html += `

    <tr id="totalPriceRow">
     <td colspan="4" class="text-end" id="totalPrice">
         Total: $${cart.totalPrice}
     </td>
    </tr>

    `;

    document.getElementById("cartTableBody").innerHTML = html;
}

async function placeOrder(event) {
    event.preventDefault();

    const response = await fetch(`${baseUrl}/shopping-cart/place-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'tina:329837487473'
        }
    });

    if (response.ok) {
        await window.alert("Thank you for your purchase");

        const table = document.getElementById("cartTableBody");
        for (let i = 0; i < table.children.length; i++) {
            document.getElementById("cartTableBody").deleteRow(i);
        }
        hideCartTable();

        document.getElementById('productTableBody').innerHTML = '';
        loadProducts();

    } else {
        const error = await response.json();
        alert(error.message);
    }

}