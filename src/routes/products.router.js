import { Router } from 'express';
import { uploader } from '../utils.js';
import productsController from '../controllers/products.controller.js';

const router = Router();

// ADD PRODUCT
router.post('/', uploader.single('thumbnail'), productsController.createProduct);

// DELETE PRODUCT BY ID
router.delete('/:idProduct', productsController.deleteProduct);

// GET PRODUCTS BY CATEGORY
router.get('/:category', productsController.getProductsByCategory);

// GET PRODUCT BY ID
router.get('/product/:idProduct', productsController.getProduct);

// UPDATE PRODUCT
router.put('/:idProduct', uploader.single('thumbnail'), productsController.updateProduct);

export default router;