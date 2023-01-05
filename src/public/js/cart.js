const socket = io();

const cartContainer = document.getElementById("cart-container");
const listProducts = document.getElementById("list-products");
const confirmButton = document.getElementById("btn-confirm");

// DELETE PRODUCT IN CART
cartContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-delete')){
       let id = e.target.id;
       let productInCart = {
            id: id,
       };
       fetch('/api/carts', {
        method: "DELETE",
        body: JSON.stringify(productInCart),
        headers: {
            "Content-Type": "application/json"
        }
        }).then(resp => resp.json())
            .then(data => socket.emit('client: delete product', data.payload.products))
            .then(Toastify({
                text: "Producto Eliminado",
                gravity: "bottom",
                backgroundColor: "orangered",
                className: "info",
            }).showToast())
    }
})

// CONFIRM PURCHASE
confirmButton.addEventListener('click', () => {
    fetch('/api/carts/confirm', {
        method: 'GET',
    }).then(resp => resp.json())
    .then(data => {
        console.log(data)
        socket.emit('client: delete product', data.payload)
    })
})

socket.on('server: products', data => {
    listProducts.innerHTML = "";
    let products = "";
    data.forEach(product => {
        products += `<tr>
                        <td class="td-delete"><i class="fas fa-trash-alt icon-delete" id=${product.product._id}></i></td>
                        <td>${product.product.title}</td>
                        <td>$${product.product.price}</td>
                        <td>${product.quantity}</td>
                        <td><img src="../img/${product.product.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                    </tr>`
    })
    listProducts.innerHTML = products;  
    if (data.length === 0){
        cartContainer.innerHTML = "<h2>Carrito de Compras</h2><p>El carrito esta vacío</p>"
    }
})