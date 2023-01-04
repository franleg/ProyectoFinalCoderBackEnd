export default class Order {
    static get model() {
        return 'Orders';
    }

    static get schema() {
        return {
            items: [
                {
                    product: String,
                    quantity: Number
                }
            ],
            order: Number,
            state: {
                type: String,
                default: 'generated'
            }, 
            email: String
        }
    }
}