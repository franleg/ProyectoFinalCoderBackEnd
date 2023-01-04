import GenericRepository from './GenericRepository.js';
import Cart from '../models/Cart.js';

export default class CartRepository extends GenericRepository {
    constructor(dao) {
        super(dao, Cart.model);
    }

    getByIdAndPopulate = (id) => {
        return this.getBy(id).populate('products.product');
    }

    updateById = (id, cart) => {
        return this.updateBy(id, cart);
    }
}