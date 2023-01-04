import GenericRepository from './GenericRepository.js';
import Product from '../models/Product.js';

export default class ProductRepository extends GenericRepository {
    constructor(dao) {
        super(dao, Product.model);
    }

    getById = (id) => {
        return this.getBy(id);
    }

    deleteById = (id) => {
        return this.deleteBy(id);
    }

    updateById = (id, product) => {
        return this.updateBy(id, product);
    }
}