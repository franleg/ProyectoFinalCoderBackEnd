import mongoose from 'mongoose';
import Cart from './Cart.js';
import Product from './Product.js';
import User from './User.js';
import Order from './Order.js'
import { logger } from '../utils.js';
import config from '../config/config.js';

export default class Dao {
    constructor() {
        this.connection = mongoose.connect(`mongodb+srv://${config.mongo.USER}:${config.mongo.PWD}@codercluster.skwuuph.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`, err => {
            if(err) logger.error(err);
            else logger.info('Connected to Atlas');
        })

        const timestamps = {
            timestamps: {
                createdAt: 'created_at', 
                updatedAt: 'updated_at'
            }
        }
        const cartSchema = mongoose.Schema(Cart.schema, timestamps);
        const productSchema = mongoose.Schema(Product.schema, timestamps);
        const userSchema = mongoose.Schema(User.schema, timestamps);
        const orderSchema = mongoose.Schema(Order.schema, timestamps);

        this.models = {
            [Cart.model]: mongoose.model(Cart.model, cartSchema),
            [Product.model]: mongoose.model(Product.model, productSchema),
            [User.model]: mongoose.model(User.model, userSchema),
            [Order.model]: mongoose.model(Order.model, orderSchema)
        }
    }

    getAll = (params, entity) => {
        if(!this.models[entity]) throw new Error('La entidad no existe');
        return this.models[entity].find(params).lean();
    }

    findOne = (params, entity) => {
        if(!this.models[entity]) throw new Error('La entidad no existe');
        return this.models[entity].findOne(params).lean();
    }

    save = (document, entity) => {
        if(!this.models[entity]) throw new Error('La entidad no existe');
        return this.models[entity].create(document);
    }

    delete = (params, entity) => {
        if(!this.models[entity]) throw new Error('La entidad no existe');
        return this.models[entity].deleteOne(params);
    }

    update = (params, document, entity) => {
        if(!this.models[entity]) throw new Error('La entidad no existe');
        return this.models[entity].findByIdAndUpdate(params, {$set: document});
    }
}