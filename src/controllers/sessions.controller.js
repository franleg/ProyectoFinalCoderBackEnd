import { logger } from '../utils.js';

const register = (req, res) => {
    try {
        let user = req.user;
        res.status(200).send({status: 'success', payload: user});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

const login = (req, res) => {
    try {
        req.session.user = {
            id: req.user._id,
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            phone: req.user.phone,
            adress: req.user.adress,
            age: req.user.age,
            avatar: req.user.avatar,
            cart: req.user.cart,
            role: req.user.role
        }
        res.status(200).send({status: 'success', payload: req.session.user});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

const registerFail = (req, res) => {
    try {
        res.status(500).send({status: 'error', error: 'Error al registrarse'});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

const loginFail = (req, res) => {
    try {
        res.status(500).send({status: 'error', error: 'Error al iniciar sessión'});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

export default {
    register,
    login,
    registerFail,
    loginFail
}