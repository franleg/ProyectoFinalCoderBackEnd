import Dao from '../models/dao.js';
import CartRepository from './CartRepositoy.js';
import ProductRepository from './ProductRepository.js';
import UserRepository from './UserRepository.js';
import OrderRepository from './OrderRepository.js';

const dao = new Dao();

export const cartService = new CartRepository(dao);
export const productService = new ProductRepository(dao);
export const userService = new UserRepository(dao);
export const orderService = new OrderRepository(dao);