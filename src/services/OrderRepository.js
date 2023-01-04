import GenericRepository from "./GenericRepository.js";
import Order from "../models/Order.js";

export default class UserRepository extends GenericRepository {
    constructor(dao) {
        super(dao, Order.model);
    }

    getByEmail = (email) => {
        return this.getAll({email});
    }  
}