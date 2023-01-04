const socket = io();

let formAdd = document.getElementById('form-addProduct');
let formDelete = document.getElementById('form-deleteProduct');
let inputDelete = document.getElementById('input-deleteProduct');
let formUpdate = document.getElementById("form-updateProduct");
let inputUpdate = document.getElementById("input-updateProduct");
let formGetProduct = document.getElementById("form-getProduct");
let inputGetProduct = document.getElementById("input-getProduct");
let listProducts = document.getElementById('list-products');
let listContainer = document.getElementById('list-container');
let productContainer = document.getElementById('product-container');
let errorAdd = document.getElementById('error-add');
let errorUpdate = document.getElementById('error-update');
let errorDelete = document.getElementById('error-delete');

// ADD NEW PRODUCT
formAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    fetch('/api/products', { 
        method: 'POST',
        body: formData
    }).then(res => res.json())
        .then(json => {
            if (!json.error) {
                errorAdd.innerHTML = "";
                socket.emit('client: add product', json.payload);
                Toastify({
                    text: "Producto Agregado",
                    gravity: "bottom",
                    backgroundColor: "#8F7CEC",
                    className: "info",
                }).showToast();
                formAdd.reset();
            }else {
                errorAdd.innerHTML = "";
                errorAdd.innerHTML = `<p class="error-message">${json.error}</p>`
                
            }
        })
});

socket.on('server: new product', data => {
    if (!listProducts) {
        listContainer.innerHTML = `<div id="table-container" class="table-container get-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Precio</th>
                                                    <th>Foto</th>
                                                </tr>
                                            </thead>
                                            <tbody id="list-products">
                                                <td>${data.title}</td>
                                                <td>$${data.price}</td>
                                                <td><img src="../img/${data.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                                            </tbody>
                                        </table>
                                    </div>`      
    }else {
        let newProduct = document.createElement('tr');
        newProduct.innerHTML = `<td>${data.title}</td>
                                <td>$${data.price}</td>
                                <td><img src="../img/${data.thumbnail}" class="img-fluid img-product" alt="imagen"></td>`
        listProducts.appendChild(newProduct)  
    }                      
})

// DELETE PRODUCT BY ID
formDelete.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = inputDelete.value;
    if (!id) {
        errorDelete.innerHTML = "";
        errorDelete.innerHTML = '<p class="error-message">El id del producto es requerido</p>'
    }else {
        fetch (`/api/products/${id}`, {
            method: 'DELETE'
        }).then(res => res.json())
            .then (json => {
                if (!json.error) {
                    socket.emit('client: delete product', json.payload);
                    Toastify({
                        text: "Producto Eliminado",
                        gravity: "bottom",
                        backgroundColor: "orangered",
                        className: "info",
                    }).showToast()
                    inputDelete.value = "";
                }else {
                    errorDelete.innerHTML = "";
                    errorDelete.innerHTML = `<p class="error-message">${json.error}</p>`
                }
            })
    }
});

socket.on('server: products', data => {
    listProducts.innerHTML = "";
    let products = "";
    data.forEach(product => {
        products += `<tr>
                        <td>${this.id}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td><img src="../img/${product.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                    </tr>`
    }) 
    listProducts.innerHTML = products;  
    if (data.length === 0){
        listContainer.innerHTML = "<p>No hay productos disponibles</p>"
    }
})

// UPDATE PRODUCT BY ID
formUpdate.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = inputUpdate.value;
    if(!id) {
        errorUpdate.innerHTML = "";
        errorUpdate.innerHTML = '<p class="error-message">El id del producto es requerido</p>'
    }else {
        let formData = new FormData(e.target);
        fetch(`/api/products/${id}`, { 
            method: 'PUT',
            body: formData
        }).then(res => res.json())
            .then(json => {
                if (!json.error) {
                    socket.emit('client: update product', json.payload);
                    Toastify({
                        text: "Producto Actualizado",
                        gravity: "bottom",
                        backgroundColor: "#8F7CEC",
                        className: "info",
                    }).showToast();
                    formUpdate.reset();
                }
                else {
                    errorUpdate.innerHTML = "";
                    errorUpdate.innerHTML = `<p class="error-message">${json.error}</p>`
                }
            })
    }
});

socket.on('server: productsUpdated', data => {
    listProducts.innerHTML = "";
    let products = "";
    data.forEach(product => {
        products += `<tr>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td><img src="../img/${product.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                    </tr>`
    }) 
    listProducts.innerHTML = products;
})

// GET PRODUCT BY ID
formGetProduct.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = inputGetProduct.value;
    if(!id) {
        productContainer.innerHTML = "";
        productContainer.innerHTML = '<p class="error-message">El id del producto es requerido</p>'
    } else {
        fetch(`/api/products/product/${id}`, { 
            method: 'GET',
        }).then(res => res.json())
            .then(json => {
                if (!json.error) {
                    socket.emit('client: get product', json.payload);
                    formGetProduct.reset();
                }
                else {
                    productContainer.innerHTML = "";
                    productContainer.innerHTML = `<p class="error-message">${json.error}</p>`
                }
            })
    }
});

socket.on('server: product', data => {
    productContainer.innerHTML = "";
    productContainer.innerHTML = `<div id="table-container" class="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Precio</th>
                                                <th>Foto</th>
                                            </tr>
                                        </thead>
                                        <tbody id="list-products">
                                                <tr>
                                                    <td>${data.title}</td>

                                                    <td>$${data.price}</td>
                                                    <td><img src="../img/${data.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                                                </tr>
                                        </tbody>
                                    </table>
                                </div>`
})