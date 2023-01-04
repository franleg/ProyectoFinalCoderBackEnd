import mongoose from 'mongoose';
import { productService } from '../services/services.js';
import { ProductInsertDTO } from '../DTOs/ProductDTO.js';
import { logger } from '../utils.js';

const createProduct = async (req, res) => {
    try {
        const { title, price, category, description, stock } = req.body;
        if(!title || !price || !category || !description || !stock) return res.status(400).send({status: 'error', error: 'Valores incompletos'});
        if(!req.file) return res.status(400).send({status: 'error', error:'Error al cargar la imagen'});
        if(isNaN(price)) return res.status(400).send({status: 'error', error: 'El precio debe ser numérico'});
        if(isNaN(stock)) return res.status(400).send({status: 'error', error:'El stock debe ser numérico'});
        const newProduct = {
            title,
            price,
            category,
            description,
            stock,
            thumbnail: req.file.filename,
        }
        const insertProduct = new ProductInsertDTO(newProduct);
        let result = await productService.save(insertProduct);
        res.status(200).send({status: 'success', payload: result});
    } catch {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    } 
}

const deleteProduct = async (req, res) => {
    try {
        let id = req.params.idProduct;
        if(!id) return res.status(400).send({status: 'error', error: 'El id del producto es requerido'});
        if(id.length !== 24) return res.status(400).send({status: 'error', error: `Formato de id incorrecto`}); 
        let prodObjectId = mongoose.Types.ObjectId(id);
        let product = await productService.getById(prodObjectId);
        if(!product) return res.status(400).send({status: 'error', error: `No se ha encontrado el producto con id ${id}`});
        await productService.deleteById(prodObjectId);
        let products = await productService.getAll();
        res.status(200).send({status: 'success', payload: products});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

const getProduct = async (req, res) => {
    try {
        let id = req.params.idProduct;
        if(!id) return res.status(400).send({error: 'El id del producto es requerido'});
        if(id.length !== 24) return res.status(400).send({status: 'error', error: `Formato de id incorrecto`}); 
        let prodObjectId = mongoose.Types.ObjectId(id);
        let result = await productService.getById(prodObjectId);
        if(!result) return res.status(400).send({status: 'error', error: `No se ha encontrado el producto con id ${id}`});
        res.status(200).send({status: 'success', payload: result});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }   
}

const getProductsByCategory = async (req,res) => {
    try {
        const products = await productService.getAll();
        const category = req.params.category;
        let productsByCategory = products.filter(prod => prod.category.split(' ').join('').toLowerCase() === category);
        if(!productsByCategory) return res.status(400).send({status: 'error', error: `No se ha encontrado la categoría`});
        res.status(200).send({status: 'success', payload: productsByCategory});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

const updateProduct = async (req,res) => {
    try {
        let id = req.params.idProduct;
        if(!id) return res.status(400).send({error: 'El id del producto es requerido'});
        if(id.length !== 24) return res.status(400).send({status: 'error', error: `Formato de id incorrecto`}); 
        let prodObjectId = mongoose.Types.ObjectId(id);
        let oldProduct = await productService.getById(prodObjectId);
        if(!oldProduct) return res.status(400).send({status: 'error', error: `No se ha encontrado el producto con id ${id}`});
        const { title, price, category, description, stock } = req.body;
        if(!title || !price || !category) return res.status(400).send({status: 'error', error: 'Valores incompletos'});
        if(!req.file) return res.status(400).send({status: 'error', error:'Error al cargar la imagen'});
        if(isNaN(price)) return res.status(400).send({status: 'error', error:`El precio debe ser numérico`});
        if(isNaN(stock)) return res.status(400).send({status: 'error', error:`El stock debe ser numérico`});
        const newProduct = {
            title,
            price,
            category,
            description,
            thumbnail: req.file.filename,
        }
        const insertProduct = new ProductInsertDTO(newProduct);
        await productService.updateById(oldProduct._id, insertProduct);
        let productsUpdated = await productService.getAll();
        res.status(200).send({status: 'succes', payload: productsUpdated});
    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Internal error", trace: error});
    }
}

export default {
    createProduct,
    getProduct,
    getProductsByCategory,
    deleteProduct,
    updateProduct
}