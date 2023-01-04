import mongoose from 'mongoose';
import { ProductPresenterDTO } from '../DTOs/ProductDTO.js';
import { UserPresenterDTO } from '../DTOs/UserDTO.js';
import { productService, cartService, userService, orderService } from '../services/services.js';
import { logger } from '../utils.js';

const home = async (req, res) => {
    try {
        const user = req.session.user;
        const result = await productService.getAll();
        const products = result.map(product => new ProductPresenterDTO(product));
        res.render(`${user.role}Home`, {
            user: user,
            hasProducts: products.length > 0,
            products,
            css: `/css/${user.role}Home.css`,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const register = (req, res) => {
    try {
        res.render('register', {
            css: '/css/register.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const login = (req, res) => {
    try {
        res.render('login', {
            css: '/css/login.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const cart = async (req, res) => {
    try {
        let user = req.session.user;
        const cartId = user.cart;
        let cartObjectId = mongoose.Types.ObjectId(cartId);
        let cart = await cartService.getByIdAndPopulate(cartObjectId);
        let products = cart.products;
        const productsInCart = products.map((product) => {
            return products = {
                product: new ProductPresenterDTO(product.product),
                quantity: product.quantity,
                id: product._id
            }
        });
        res.render('cart', {
            user,
            hasProducts: productsInCart.length > 0,
            productsInCart,
            css: '/css/cart.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const orders = async (req, res) => {
    try {
        const user = req.session.user;
        const orders = await orderService.getByEmail(user.email);
        for (let order of orders) console.log(order.items)
        res.render('userOrders', {
            hasOrders: orders.length > 0,
            user,
            orders: orders,
            css: '/css/userOrders.css'
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const registerFail = (req, res) => {
    try {
        let errorMessage = req.flash('error')[0];
        res.locals.errorMessage = errorMessage;
        res.render('registerFail', {
            css: '/css/registerFail.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const loginFail = (req, res) => {
    try {
        let errorMessage = req.flash('error')[0];
        res.locals.errorMessage = errorMessage;
        res.render('loginFail', {
            css: '/css/loginFail.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const logout = (req, res) => {
    try {
        const user = req.session.user;
        req.session.destroy(err => {
            if (err) {
              return res.status(400).send({status: 'error', error: 'Unable to log out'});
            } else {
                res.render('logout', {
                    user,
                    css: '/css/logout.css',
                })
            }
          }); 
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const productsPanel = (req, res) => {
    try {
        res.render('productsPanel', {
            css: '/css/productsPanel.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const usersPanel = async (req, res) => {
    try {
        const result = await userService.getAll();
        const users = result.map(user => new UserPresenterDTO(user));
        res.render('usersPanel', {
            users,
            hasUsers: users.length > 0,
            css: '/css/usersPanel.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const error404 = (req, res) => {
    try {
        res.render('error404', {
            css: '/css/error404.css',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

export default {
    home,
    cart,
    orders,
    register,
    login,
    registerFail,
    loginFail,
    logout,
    productsPanel,
    usersPanel,
    error404,
}