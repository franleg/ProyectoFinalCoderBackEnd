import mongoose from 'mongoose';

export default class User {
    static get model() {
        return 'Users';
    }
    
    static get schema() {
        return {
            first_name: String,
            last_name: String,
            age: Number,
            adress: String,
            phone: String,
            email: String,
            password: String,
            avatar: String,
            role: {
                type: String,
                enum: ['user', 'admin'],
                default: 'user'
            },
            cart: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Carts',
            }
        }
    }
}