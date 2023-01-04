const socket = io();

const cardsContainer = document.getElementById("cards-container");
const addIcon = document.getElementById("add-icon");
const substractIcon = document.getElementById("substract-icon");
const select = document.getElementById("select");

// ADD PRODUCT IN CART
cardsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-icon')) {
        let quantity = e.target.previousSibling.previousElementSibling;
        quantity.innerHTML = parseInt(quantity.textContent) + 1;
    }

    if (e.target.classList.contains('substract-icon')) {
        let quantity = e.target.nextSibling.nextElementSibling;
        if (quantity.innerHTML > 1) quantity.innerHTML = parseInt(quantity.textContent) - 1;
    }

    if (e.target.classList.contains('add_cart')) {
        let id = e.target.id;
        let container = e.target.previousSibling.previousElementSibling;
        let quantity = container.childNodes[3].innerHTML;
        let product = {
            id: id,
            quantity: quantity
        };
        fetch('/api/carts', {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json())
            .then(json => {
                if(json.status == 'error') return Toastify({
                    text: `${json.error}`,
                    gravity: "bottom",
                    backgroundColor: 'orangered',
                    className: "info",
                }).showToast()
                else Toastify({
                    text: "Producto Agregado",
                    gravity: "bottom",
                    backgroundColor: '#8F7CEC',
                    className: "info",
                }).showToast()
            })
    }
})
 
// SELECT CATEGORY
select.addEventListener('change', (e) => {
    let category = select.value;
    fetch(`/api/products/${category}`, {
        method: "GET",
    }).then(resp => resp.json())
        .then(json => {
            if (!json.error) socket.emit('client: get products by category', json.payload)
            else {
                let messageError = document.createElement('div');
                messageError.innerHTML = `<p style="color:red">${json.error}</p>`
                cardsContainer.appendChild(messageError);
            }
        })
})

socket.on('server: products by category', data => {
    if(data.length == 0) return cardsContainer.innerHTML = "<p>No hay productos para esta categoría</p>";
    cardsContainer.innerHTML = "";
    let products = "";
    data.forEach(product => {
        products += `<div class="card">
                        <img src="../img/${product.thumbnail}" class="card-img-top img-cards img-fluid">
                        <div class="card-body text-center">
                            <h3 class="card-title">${product.title}</h3>
                            <hr class="card-hr">
                            <div>
                                <span>$${product.price}</span>
                            </div>
                            <h5 class="counter-title">Cantidad</h5>
                            <div class="quantity-container">
                                <div class="substract-icon quantity-icon" id="substract-icon">-</div>
                                <div class="quantity" id="quantity">1</div>
                                <div class="add-icon quantity-icon" id="add-icon">+</div>
                            </div>
                            <i id="${product.id}" class="fas fa-cart-plus add_cart"></i>
                        </div>
                    </div> `
    }) 
    cardsContainer.innerHTML = products;
})