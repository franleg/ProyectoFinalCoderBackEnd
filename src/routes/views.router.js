import { Router } from 'express';
import viewsController from '../controllers/views.controller.js';
import authentication from '../middlewares/auth.js';

const router = Router();

router.get('/', authentication.privateValidation, viewsController.home);

router.get('/register', authentication.publicValidation, viewsController.register);

router.get('/login', authentication.publicValidation, viewsController.login);

router.get('/logout', authentication.privateValidation, viewsController.logout);

router.get('/cart', authentication.privateValidation, authentication.executePolicies (['USER']), viewsController.cart);

router.get('/orders', authentication.privateValidation, authentication.executePolicies (['USER']), viewsController.orders);

router.get('/registerfail', viewsController.registerFail);

router.get('/loginfail', viewsController.loginFail);

router.get('/productsPanel', authentication.privateValidation, authentication.executePolicies(['ADMIN']), viewsController.productsPanel);

router.get('/usersPanel', authentication.privateValidation, authentication.executePolicies(['ADMIN']), viewsController.usersPanel);

router.get('/*', viewsController.error404);

export default router;