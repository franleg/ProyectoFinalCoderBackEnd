import mongoose from 'mongoose';
import { cartService, productService, orderService } from '../services/services.js';
import { transporter, messageHTML, logger } from '../utils.js';
import config from '../config/config.js';

const addProductInCart = async (req, res) => {
    try {
        let { id, quantity } = req.body;
        let prodObjectId = mongoose.Types.ObjectId(id);
        let product = await productService.getById(prodObjectId);
        quantity = parseInt(quantity);
        const user = req.session.user;
        if(!user) return res.redirect('/login');
        const cartId = user.cart;
        let cartObjectId = mongoose.Types.ObjectId(cartId);
        let cart = await cartService.getByIdAndPopulate(cartObjectId);
        let exists = cart.products.find(prod => (prod.product._id).toString() === id)
        if(exists) {
            exists.quantity += quantity;
        }
        else {
            cart.products.push({
                product,
                quantity
            });
        }
        let result = await cartService.updateById(cart._id, cart)
        res.status(200).send({status: 'success', payload: result});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

const deleteProductInCart = async (req, res) => {
    try {
        const user = req.session.user;
        const cartId = user.cart;
        let cartObjectId = mongoose.Types.ObjectId(cartId);
        let cart = await cartService.getByIdAndPopulate(cartObjectId);
        const productId = req.body.id;
        let prodObjectId = mongoose.Types.ObjectId(productId);
        const productInCart = cart.products.find(prod => prod.product._id.toString() == prodObjectId);
        let productIndex = cart.products.indexOf(productInCart);
        cart.products.splice(productIndex, 1);
        await cartService.updateById(cartObjectId, cart);
        cart = await cartService.getByIdAndPopulate(cartObjectId);
        let product = await productService.getById(prodObjectId);
        product.stock += productInCart.quantity
        await productService.updateById(product._id, product);
        res.status(200).send({status: 'success', payload: cart}); 
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

const confirmPurchase = async (req, res) => {
    try {
        const user = req.session.user;
        const cartId = user.cart;
        let cartObjectId = mongoose.Types.ObjectId(cartId);
        let cart = await cartService.getByIdAndPopulate(cartObjectId);
        let emailToUser = await transporter.sendMail({
            from: 'Yo',
            to: user.email,
            subject: 'Confirmación de compra',
            html: `<div>
                    <h1>¡Hola ${user.name}, gracias por tu compra!</h1>
                    <h2>Detalle de la orden:</h2>
                    ${messageHTML(cart)}
                </div>`
        })
        let emailToAdmin = await transporter.sendMail({
            from: 'Yo',
            to: config.admin.EMAIL,
            subject: `Nuevo pedido de ${user.name}`,
            html: `<div>
                    <h1>Nuevo pedido de ${user.name}</h1>
                    <h2>Detalles del usuario:</h2>
                    <p>Email: ${user.email}</p>
                    <p>Dirección: ${user.adress}</p>
                    <p>Teléfono: ${user.phone}</p>
                    <h2>Detalle de la orden:</h2>
                    ${messageHTML(cart)}
                </div>`
        })
        const orders = await orderService.getAll();
        const newOrder = {
            items: [],
            email: user.email
        }
        cart.products.forEach(product => {
            const item = {
                product: product.product.title,
                quantity: product.quantity                
            }
            newOrder.items.push(item);
        })
        if(orders.length == 0) {
            newOrder.order = 1;
        } else {
            newOrder.order = orders[orders.length-1].order + 1;
        }
        await orderService.save(newOrder);
        cart.products = [];
        await cartService.updateById(cartObjectId, cart);
        logger.info(emailToUser, emailToAdmin);
        res.send({status: 'success', payload: cart.products});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

export default {
    addProductInCart,
    deleteProductInCart,
    confirmPurchase
}