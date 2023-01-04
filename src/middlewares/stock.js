import mongoose from "mongoose";
import { productService } from '../services/services.js';

// MIDDLEWARE OF STOCK VALIDATION
const stockValidation = async (req, res, next) => {
    let { id, quantity } = req.body;
    let prodObjectId = mongoose.Types.ObjectId(id);
    let product = await productService.getById(prodObjectId);
    quantity = parseInt(quantity);
    if (quantity > product.stock) return res.status(200).send({status: 'error', error:'No hay suficiente stock'});
    product.stock -= quantity;
    await productService.updateById(product._id, product);
    next();
}

export default {
    stockValidation
}