import { userService } from '../services/services.js';
import { logger } from '../utils.js';

const getUsers = async (req, res) => {
    try {
        let users = await userService.getUsers();
        res.send({status: 'success', payload: users});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error}); 
    }
}

const getUserById = async (req, res) => {
    try {
        const { idUser } = req.params;
        const user = await userService.getUserById(idUser);
        if (!user) return res.status(404).send({status: 'error', error: 'Usuario no encontrado'})
        res.send({status: 'success', payload: user});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

export default {
    getUsers,
    getUserById,
}