import { Router } from 'express';
import cartsController from '../controllers/carts.controller.js';
import validation from '../middlewares/stock.js';

const router = Router();

// ADD PRODUCT
router.post('/', validation.stockValidation, cartsController.addProductInCart);

// DELETE PRODUCT
router.delete('/', cartsController.deleteProductInCart);

// CONFIRM PURCHASE
router.get('/confirm', cartsController.confirmPurchase);

export default router;