export default class Product {
    static get model() {
        return 'Products';
    }

    static get schema() {
        return {
            title: String,
            price: Number,
            category: String,
            description: String,
            stock: Number,
            thumbnail: String,
            timestamp: String,
            code: String,
        }
    }
}