export class ProductPresenterDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.category = product.category;
        this.price = product.price;
        this.stock = product.stock;
        this.description = product.description;
        this.thumbnail = product.thumbnail;
    }
}

export class ProductInsertDTO {
    constructor(product) {
        this.title = product.title;
        this.price = product.price;
        this.category = product.category;
        this.description = product.description;
        this.stock = product.stock;
        this.thumbnail = product.thumbnail;
        this.code = Math.random().toString(35).substring(3);
    }
}