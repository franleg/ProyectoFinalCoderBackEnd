import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

// GET USERS 
router.get('/', usersController.getUsers);

// GET USER BY ID 
router.get('/:idUser', usersController.getUserById);

export default router;